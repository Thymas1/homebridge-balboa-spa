# Replacing the Balboa WiFi module with an Elfin-EW11

This folder documents the in-progress hardware swap of the spa's stock Balboa
`BWGWIFI1` WiFi module with an **Elfin-EW11** (RS-485 ↔ WiFi bridge). The goal is
to keep this Homebridge plugin's TCP-on-port-4257 protocol identical while
replacing the unreliable Balboa WiFi radio with a more stable bridge.

## Why we're doing this

The Balboa WiFi module has been the suspected root cause of the connection
drops that the reliability fixes in `src/spaClient.ts` work around (exponential
backoff, keepalive ping, stale-check, etc). Swapping the radio while keeping
the spa pack and its serial protocol intact should give a stable WiFi link
without changing any plugin code.

## Current status — paused mid-install

| Step | State |
|------|-------|
| Buy Elfin-EW11A-0 (enclosed, RS-485 variant) | ✅ Done |
| Bench-configure EW11 (WiFi, IP, serial, TCP server) | ✅ Done — verified |
| Identify spa hardware (BP21/SRBP21, BWGWIFI1 module, Mini-Fit Jr cable) | ✅ Done |
| Open spa control box and photograph main board WiFi header | ⏳ Next session |
| Multimeter-verify spa-side header pinout (V+, GND, A, B) | ⏳ Next session |
| Cut BWGWIFI1 cable, wire to EW11 pigtail, install | ⏳ Next session |
| Power up, verify Homebridge reconnects | ⏳ Next session |

We paused here so the user can resume with his father in a few weeks.

## Files in this folder

- **[EW11-CONFIG.md](EW11-CONFIG.md)** — Every setting we put on the EW11 so it
  can be reconstructed from scratch if the device is factory-reset. Includes
  the verified network settings, serial port, and TCP server config.
- **[SPA-HARDWARE.md](SPA-HARDWARE.md)** — Identification of the spa control
  pack (Balboa BP21 / SRBP21), the original BWGWIFI1 WiFi module, and the
  Molex Mini-Fit Jr connector and cable harness between them.
- **[INSTALL-PROCEDURE.md](INSTALL-PROCEDURE.md)** — Step-by-step procedure
  for the remaining install work, picking up exactly where we paused.
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** — Things we hit during the
  bench config that are worth knowing about (e.g. the EW11 ignores ICMP ping,
  STA mode takes 30-60s to populate ARP after restart, WAN vs LAN settings
  pitfall).

## Quick reference (the things you'll need first)

- **EW11 IP** (after install): `192.168.72.43` (we deliberately reused the
  Balboa module's IP so no `config.json` change is needed on the Homebridge
  Pi)
- **EW11 web UI**: `http://192.168.72.43/` — login `admin` / `admin`
- **EW11 MAC**: `74:E9:D8:9E:17:4C`
- **TCP test command**: `nc -zv 192.168.72.43 4257` (this should succeed; ICMP
  ping does **not** work — the EW11 firmware blocks it)
- **Spa WiFi network**: `Endresen` (192.168.72.x subnet, gateway 192.168.72.1)
  — note that `HestErLikLim` mentioned in `CLAUDE.md` is a different network
  for unrelated devices
- **Homebridge Pi**: `goddo` at `192.168.72.223:8581`
