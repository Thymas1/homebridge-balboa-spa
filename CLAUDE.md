# Homebridge Balboa Spa Improved

Fork of [homebridge-plugin-bwaspa](https://github.com/vincedarley/homebridge-plugin-bwaspa) with connection reliability improvements.

## Key Details

- **npm package**: `homebridge-balboa-spa-improved`
- **Platform name**: `Balboa-Spa-Improved`
- **Spa**: Balboa WiFi module at `192.168.72.43:4257`, model SRBP21X
- **Homebridge Pi**: `192.168.72.223:8581` (hostname "goddo")
- **Install path on Pi**: `/var/lib/homebridge/node_modules/`

## Development

```bash
npm run build    # Compile TypeScript
npm run lint     # ESLint
```

## Deploying to Homebridge

On the Pi's Homebridge terminal:
```bash
cd /var/lib/homebridge/node_modules && npm install github:Thymas1/homebridge-balboa-spa
```
Then restart Homebridge.

## Architecture

- `src/spaClient.ts` — Core TCP connection to spa, message parsing, state management
- `src/platform.ts` — Homebridge platform plugin, accessory discovery and registration
- `src/discovery.ts` — UDP broadcast discovery of spa on LAN
- `src/*Accessory.ts` — Individual HomeKit accessory implementations

## Connection Reliability (our improvements)

All in `spaClient.ts`:
- Exponential backoff: 2s → 60s cap, resets on success
- TCP keepalive enabled (10s initial delay)
- Keepalive ping every 30s (ControlTypes request)
- Connection timeout: 10s
- Stale check every 2min with soft recovery before forced reconnect

## In-progress: Elfin-EW11 hardware swap

The Balboa WiFi module is being replaced with an Elfin-EW11 (RS-485 ↔ WiFi
bridge) for connection stability. The TCP-on-port-4257 protocol stays the
same; the EW11 reuses the same IP `192.168.72.43`, so no plugin config
changes are needed. **Bench config is complete and verified; physical
install is paused mid-procedure.**

See **[`docs/elfin-swap/`](docs/elfin-swap/)** for the full context:
- `README.md` — overview and current status checklist
- `EW11-CONFIG.md` — every setting on the EW11 device
- `SPA-HARDWARE.md` — spa pack and connector identification
- `INSTALL-PROCEDURE.md` — step-by-step procedure to resume from
- `TROUBLESHOOTING.md` — gotchas we hit during bench config
