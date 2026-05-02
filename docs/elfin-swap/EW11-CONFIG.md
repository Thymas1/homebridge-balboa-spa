# Elfin-EW11 Configuration

Reference for the exact settings we applied to the EW11 during bench
configuration on 2026-05-02. If the device is factory-reset, these are the
settings to put back in.

## Hardware

- **Model**: Elfin-EW11 (enclosed black aluminum case, RS-485 ↔ WiFi)
- **Firmware**: `26L11_4.0`
- **MAC**: `74:E9:D8:9E:17:4C`
- **Power input**: 5–36 VDC @ 5W max — bench tested with USB 5V via a
  cut-up wired-mouse cable
- **Bundled accessory**: RJ45-plug-to-screw-terminal pigtail (green Phoenix
  block, labels `A / + / − / B` for RS-485 mode, alternative `Tx / + / − / Rx`
  for TTL mode)

## EW11 RJ45 jack pinout (from the case label)

| Pin | Function |
|-----|----------|
| 1   | NC |
| 2   | NC |
| 3   | NC |
| 4   | Reload (factory reset — pull low for ~5s) |
| 5   | A+ (RS-485 +) |
| 6   | B− (RS-485 −) |
| 7   | VCC (5–36 VDC) |
| 8   | GND |

## Web UI access

- URL: `http://10.10.100.254/` when connected to the EW11's own AP, or
  `http://192.168.72.43/` once it's joined the home WiFi
- Default login: `admin` / `admin`

## Settings (page-by-page)

### System Settings

**Authentication**
- User Name: `admin`
- Password: `admin`

**Basic Settings**
- Host Name: `EW11`

**WAN Settings** *(this is the connection to the home WiFi — what the
Homebridge plugin reaches)*
- DHCP: **OFF**
- WAN IP: `192.168.72.43`
- Subnet Mask: `255.255.255.0`
- Gateway: `192.168.72.1`
- DNS: `192.168.72.1`

**LAN Settings** *(the EW11's own AP fallback, mostly irrelevant in
production)*
- LAN IP: `10.10.100.254` (default)
- Mask: `255.255.255.0`
- DHCP Server: ON

**WiFi Settings**
- WiFi Mode: **STA**
- STA SSID: `Endresen`
- STA KEY: *(the user's home WiFi password — not stored in this repo)*

**Telnet / Web / NTP / Modbus**
- Telnet: OFF
- Web: ON, port `80`
- NTP: OFF
- Modbus TimeOut Automatic: ON

### Serial Port Settings

**Basic Settings**
- Baud Rate: `115200`
- Data Bit: `8`
- Stop Bit: `1`
- Parity: `None`

**Buffer Settings**
- Buffer Size: `512`
- Gap Time: `50`

**Flow Control Settings**
- Flow Control: **`Half Duplex`**
  - This is the correct value for **RS-485**. It enables the EW11's automatic
    direction control of the RS-485 driver. Don't change it to `None` — that's
    only for TTL/UART mode.

**CLI Settings**
- Cli: `Serial String`
- Serial String: `+++`
- Waiting Time: `300`

**Protocol Settings**
- Protocol: `None`

### Communication Settings *(the TCP server profile, named `netp`)*

**Basic Settings**
- Name: `netp` (default)
- Protocol: **`Tcp Server`**

**Socket Settings**
- Local Port: **`4257`** *(this is what the Homebridge plugin connects to —
  must match the original Balboa port)*
- Buffer Size: `512`
- Keep Alive: `60`
- Timeout: `0` (no timeout)

**Protocol Settings**
- Max Accept: `3`

**More Settings**
- Security: `Disable`
- Route: **`Uart`** *(critical — routes TCP socket data through the serial
  port; without this, the spa can't be reached)*

## Verification commands (run from a Mac on the same LAN)

```bash
# Check it's on the network at the right IP (look for the EW11 MAC)
arp -a | grep -i "74:e9:d8"

# Confirm TCP server is up — this is the canonical reachability test
nc -zv 192.168.72.43 4257

# Web UI alive (expect HTTP 401 — admin/admin auth)
curl -s -o /dev/null -w "%{http_code}\n" http://192.168.72.43/

# DO NOT use ping — the EW11 firmware blocks ICMP. Ping failures are normal.
```

## How long things take

- **Boot to network reachable**: ~5–10 seconds after power-up.
- **Settings persistence**: All settings survive power cycles. Tested by
  power-cycling immediately after the first successful network join — it
  came back online in ~5s with all settings intact.
- **STA WiFi connection**: First time after a `Submit + Restart`, the device
  may take 30–60s before ARP populates. This is normal. Be patient before
  troubleshooting.
