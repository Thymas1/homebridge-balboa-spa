"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverSpas = void 0;
const udp = __importStar(require("dgram"));
/**
 * Try to find a Spa on the network automatically, using UDP broadcast
 * @param log
 * @param foundSpaCallback call with the ip address of any Spa found on the network
 */
function discoverSpas(log, foundSpaCallback) {
    const discoveryFunction = () => {
        // creating a client socket
        const client = udp.createSocket({ type: 'udp4', reuseAddr: true });
        const host = '255.255.255.255';
        // Balboa Wifi module listens on this port.
        const port = 30303;
        const timeout = 10000;
        client.on('message', (msg, info) => {
            log.debug('UDP Data received from server :', msg.toString());
            log.debug('UDP Received %d bytes from %s:%d', msg.length, info.address, info.port);
            if (msg.length >= 6 && msg.slice(0, 6) == 'BWGSPA') {
                log.info('Discovered a Spa at', info.address);
                // Cancel the repeated tries - we've found the spa.
                clearInterval(broadcastIntervalId);
                foundSpaCallback(info.address);
            }
        });
        //buffer msg - doesn't really matter what we send
        const data = Buffer.from('Discovery: Who is out there?');
        // I don't fully understand this line, but it is essential to this function working.
        client.bind(() => {
            client.setBroadcast(true);
        });
        //sending msg
        client.send(data, port, host, (error) => {
            if (error) {
                log.warn(error);
                client.close();
            }
            else {
                log.debug('UDP discovery broadcast message sent - attempting to find a spa');
            }
        });
        setTimeout(() => {
            log.debug('Closing spa discovery search');
            client.close();
        }, timeout);
    };
    // Try every 20 seconds to discover the Spa, waiting 10 seconds each time for a response.
    const broadcastIntervalId = setInterval(discoveryFunction, 20 * 1000);
    // But start immediately.
    log.info("Searching for spa on the local network - will re-broadcast every 20 seconds until success.");
    discoveryFunction();
}
exports.discoverSpas = discoverSpas;
//# sourceMappingURL=discovery.js.map