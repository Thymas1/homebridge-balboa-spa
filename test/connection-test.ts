/**
 * Standalone connection test for the improved SpaClient.
 *
 * Usage:
 *   npx ts-node test/connection-test.ts [spa-ip]
 *
 * Stop the existing Balboa Spa plugin in Homebridge first — the spa
 * only accepts one TCP connection at a time.
 */
import * as net from 'net';

const SPA_HOST = process.argv[2] || '192.168.72.43';
const SPA_PORT = 4257;

// Minimal logger that matches the Homebridge Logger interface
const log = {
  info: (...args: any[]) => console.log(`[${new Date().toLocaleTimeString()}] [INFO]`, ...args),
  warn: (...args: any[]) => console.log(`[${new Date().toLocaleTimeString()}] [WARN]`, ...args),
  error: (...args: any[]) => console.log(`[${new Date().toLocaleTimeString()}] [ERROR]`, ...args),
  debug: (...args: any[]) => {},  // silent in test
};

let messageCount = 0;
let stateCount = 0;
let lastMessageTime = Date.now();
const StateReply = Buffer.from([0xff, 0xaf, 0x13]);

function prettify(buf: Buffer | Uint8Array) {
  return Buffer.from(buf).toString('hex').match(/.{1,2}/g)?.join(',');
}

log.info(`Connecting to Spa at ${SPA_HOST}:${SPA_PORT}...`);

const socket = net.connect({ port: SPA_PORT, host: SPA_HOST }, () => {
  log.info('Connected!');
  socket.setKeepAlive(true, 10000);
});

socket.on('data', (data: Buffer) => {
  messageCount++;
  lastMessageTime = Date.now();

  const buf = new Uint8Array(data);
  if (buf.length >= 5 && buf[2] === 0xff && buf[3] === 0xaf && buf[4] === 0x13) {
    stateCount++;
    // Parse a few key fields from state message
    const contents = buf.slice(5, buf[1]);
    if (contents.length >= 21) {
      const currentTemp = contents[2] === 255 ? 'unknown' : (contents[2] / 2.0).toFixed(1) + '°C';
      const hour = contents[3];
      const minute = contents[4];
      const isHeating = (contents[10] & 48) !== 0;
      const targetTemp = (contents[20] / 2.0).toFixed(1) + '°C';

      if (stateCount % 10 === 1) {
        log.info(`State #${stateCount}: temp=${currentTemp}, target=${targetTemp}, heating=${isHeating}, time=${hour}:${String(minute).padStart(2, '0')}`);
      }
    }
  } else {
    log.info(`Message #${messageCount}: type=${prettify(buf.slice(2, 5))}, len=${buf[1]}, data=${prettify(buf)}`);
  }
});

socket.on('error', (err) => {
  log.error('Socket error:', err.message);
});

socket.on('close', (hadError) => {
  log.warn(`Socket closed (hadError=${hadError}). Received ${messageCount} messages (${stateCount} state updates) total.`);
  process.exit(hadError ? 1 : 0);
});

socket.on('end', () => {
  log.warn('Socket ended by spa.');
});

// Periodic status
setInterval(() => {
  const silentFor = ((Date.now() - lastMessageTime) / 1000).toFixed(0);
  log.info(`Status: ${messageCount} messages, ${stateCount} state updates, silent for ${silentFor}s`);
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
  log.info(`\nShutting down. Received ${messageCount} messages (${stateCount} state updates) total.`);
  socket.end();
  socket.destroy();
  process.exit(0);
});

log.info('Listening for spa messages... (Ctrl+C to stop)');
log.info('State updates are logged every 10th message to avoid spam.');
