# Homebridge Balboa Spa Improved

A Homebridge plugin for Balboa Spa/Hot-tub WiFi modules with improved connection reliability.

## What it does

Connects to your Balboa spa via its WiFi module and exposes controls to HomeKit:

- Thermostat and temperature sensor
- Pumps (up to 6, with multi-speed support)
- Lights, blower, mister, aux controls
- Water flow problem sensor (leak sensor)
- Hold mode, panel lock, heat mode switches

Auto-discovers your spa on the network and auto-creates all accessories.

## Improvements over the original

This is a fork of [homebridge-plugin-bwaspa](https://github.com/vincedarley/homebridge-plugin-bwaspa) by [vincedarley](https://github.com/vincedarley), with connection reliability improvements:

- **Exponential backoff** on reconnect (2s → 60s cap) instead of fixed 20s retry loops
- **TCP keepalive** to detect dead connections at the OS level
- **Periodic keepalive ping** every 30s to prevent idle disconnects
- **Connection timeout** (10s) to catch hanging connect attempts
- **Faster stale detection** (2min instead of 15min) with soft recovery before forced reconnect
- **Better error logging** — actual error messages instead of generic "Had error"

## Installation

### From GitHub (recommended for now)

```bash
cd /var/lib/homebridge/node_modules && npm install github:Thymas1/homebridge-balboa-spa
```

### From npm (once published)

```bash
npm install -g homebridge-balboa-spa-improved
```

## Configuration

Add to your Homebridge `config.json`:

```json
{
    "name": "Spa",
    "autoCreateAccessories": true,
    "host": "192.168.1.xxx",
    "platform": "Balboa-Spa-Improved"
}
```

Setting `host` explicitly is recommended. If omitted, the plugin will attempt UDP discovery.

## Updating

```bash
cd /var/lib/homebridge/node_modules && npm install github:Thymas1/homebridge-balboa-spa
```

Then restart Homebridge.

## Credits

Based on [homebridge-plugin-bwaspa](https://github.com/vincedarley/homebridge-plugin-bwaspa) by [vincedarley](https://github.com/vincedarley). Licensed under Apache-2.0.
