# Spa Hardware Identification

Documentation of the spa pack and original WiFi module being replaced.
Verified from photos taken 2026-05-02.

## Spa control system

- **Brand**: Balboa Water Group
- **System**: BP21 Spa Control System
- **Model**: `SRBP21`
- **Agency Model**: `BP21-SRBP21-RCA_3.0KW`
- **System S/N**: `56362-011603150013`
- **Part Number**: `56362-01`
- **Spa model**: `S104E`
- **Manufactured by**: Leisure Manufacturing, Grimsby, Ontario, Canada
- **Manufacture date**: March 28, 2016
- **Power**: 230V / 50Hz / 16/32A (also supports 3-phase 400VAC)

## Original Balboa WiFi module (being replaced)

- **Model**: `BWGWIFI1`
- **FCC ID**: `W7OZG2100-ZG2101`
- **IC**: `8248A-G21ZEROG`
- **S/N**: `50360-031509100003`
- **Form factor**: White plastic enclosure with embossed "UP" arrow,
  zip-tied to the equipment bay
- **Cable**: captive (no connector on the module side; soldered/molded in)

## Cable between BWGWIFI1 and spa main board

- **Cable harness P/N**: Balboa `25657 REV.D` (heat-shrink label visible
  near the connector)
- **Cable date code**: `MXOG 41/15` (week 41 of 2015)
- **Cable jacket markings**: `AWM 1/I A FT1 80°C 300V 28AWG LM`
- **Conductors**: **4 individual black-jacketed wires** (verified by user
  visual count — all same color, no easy-ID stripes)
- **Connector at spa-board end**: Molex Mini-Fit Jr **`43020`** series,
  4-circuit (2×2), female receptacle with locking latch and polarizing key

## Connector pinout convention

When looking **into** the male header on the spa main board (i.e. looking at
the pins from the cable's approach direction), with the polarizing key/latch
oriented **at the top**:

```
┌─────────┬─────────┐
│  Pin 1  │  Pin 2  │
├─────────┼─────────┤
│  Pin 3  │  Pin 4  │
└─────────┴─────────┘
```

**Community-documented Balboa BP-series convention** (verify with multimeter
before trusting):

| Pin | Function | Wire role for EW11 |
|-----|----------|--------------------|
| 1   | +12V (or +5V) | → EW11 pigtail `+` |
| 2   | GND | → EW11 pigtail `−` |
| 3   | A (RS-485 +) | → EW11 pigtail `A` |
| 4   | B (RS-485 −) | → EW11 pigtail `B` |

This **must be verified with a multimeter** before cutting the cable.
See [INSTALL-PROCEDURE.md](INSTALL-PROCEDURE.md) for the verification steps.

## Important notes

- All 4 wires in the cable are the same black color. There's no visual
  way to tell which wire goes to which pin — the only way is **continuity
  testing** between each stripped wire end and each connector pin after
  identifying the pinout via multimeter.
- The cable has a **rubber strain-relief / waterproof boot** along its
  length. We want to preserve this when cutting — it's worth keeping for
  the replacement install for cable management and humidity protection.
- The Balboa main board has **230V mains** terminals around the edges.
  The 4-pin WiFi header itself is low-voltage and safe, but stay focused
  on it and don't slip onto adjacent traces during multimeter probing.

## What lives on the network already

From a `192.168.72.x` ARP scan during bench setup:

- `192.168.72.1` — `router.asus.com` (gateway)
- `192.168.72.94` — `esp_5598d1` (some ESP-based device, NOT the spa or EW11
  — was on the network before the swap began)
- `192.168.72.139` — Pulse-something
- `192.168.72.140` — Sonos
- `192.168.72.223` — `goddo` (the Homebridge Pi — main target)
- `192.168.72.43` — was the original Balboa WiFi module; now reserved
  for the EW11 (we kept the same IP to avoid touching plugin config)
