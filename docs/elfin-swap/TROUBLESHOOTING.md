# Troubleshooting Notes

Things we hit during the bench-config phase that are worth remembering.
Ordered roughly by likelihood of being relevant during the resume session.

## ICMP ping doesn't work — that is normal

The Elfin-EW11 firmware (`26L11_4.0`) **blocks ICMP echo requests**. So
`ping 192.168.72.43` will fail with timeouts even when the device is fully
working.

**Use `nc -zv 192.168.72.43 4257` as the canonical reachability test
instead.** TCP connect succeeds when the device is up.

This caught us during bench testing — we thought the EW11 wasn't joining
the network until we realized ping was blocked but the TCP socket was
working fine.

## STA WiFi connection takes 30–60 seconds after `Restart`

When you click `Submit` and then `Restart` in the EW11 web UI, the device
takes a noticeable amount of time after reboot before its STA mode
connection is fully populated in the network's ARP tables. ARP scans will
show the IP as `(incomplete)` for up to a minute.

**Be patient.** Don't power-cycle or factory-reset just because ping fails
in the first 30 seconds. Wait at least a full minute before assuming STA
mode failed.

## WAN vs LAN settings — easy to get backwards

The EW11 firmware splits its network config into:

- **WAN settings** = the connection to the home WiFi (when in STA mode).
  This is the IP that external clients (like the Homebridge plugin) will
  reach.
- **LAN settings** = the EW11's own internal AP fallback (the
  `EW11_xxxx` SSID it broadcasts).

We initially put the static IP `192.168.72.43` into the LAN section,
which did nothing useful — the EW11 grabbed a random DHCP IP on the WAN
side instead. Fix: turn WAN DHCP **OFF** and put the static IP under
**WAN Settings**, leaving LAN at its default `10.10.100.254`.

## "Submit" only saves; you still need "Restart"

Clicking `Submit` on each settings page in the EW11 UI writes to flash
but does **not** apply the changes. You have to navigate to a separate
`Restart` page (or button somewhere in the menu) and trigger a reboot for
new settings to take effect.

We saw the symptom of "I clicked Submit but the EW11's AP didn't go away
and it never joined the home WiFi" — that's because the new WiFi settings
hadn't been activated yet.

## The EW11's own AP stays visible alongside STA mode

This firmware keeps its `EW11_174C` AP broadcasting **even while it's
connected to the home WiFi as a station**. Don't be confused by seeing
the AP in WiFi lists — it's normal. The AP only really disappears
during the brief boot/transition window.

## Pigtail terminal layout — labels are above the holes

The green Phoenix-style screw terminal block on the EW11 pigtail has the
labels molded into the **black plastic above** the green block, not on
the green block itself. Each column of label sits directly over its
screw hole. Left to right when the labels read normally:

```
┌─────────────────────────┐
│   A    +    −    B      │   ← top row (RS-485 mode)
│   Tx   +    −    Rx     │   ← bottom row (TTL/UART mode — ignore)
├─────────────────────────┤
│  [⊙]  [⊙]  [⊙]  [⊙]    │   ← four screw holes
└─────────────────────────┘
```

We use the **top row** labels.

## Polarity matters for power

USB cables: red = +5V, black = GND. Always.

DC barrel-plug power supplies: **NOT** color-coded by convention.
Different manufacturers wire them differently. If you ever use a wall
wart instead of USB, **always verify polarity with a multimeter**
before connecting.

## Half-Duplex flow control on the EW11 is correct

The EW11 web UI's "Flow Control" setting under Serial Port Settings is
defaulted to `Half Duplex` — leave it that way. RS-485 is inherently
half-duplex (single twisted pair shared between TX and RX), and this
setting enables the EW11's automatic direction control of its RS-485
driver. Setting it to `None` would only be correct for plain TTL UART,
which is not what we're using.

## If you really lock yourself out of the EW11

Pin 4 on the RJ45 is `Reload` — pull it low (short to GND, which is
pin 8) for ~5 seconds to factory-reset.

Note: the pigtail's screw terminals only expose pins 5–8 (the A, +, −, B
signals). They do **NOT** expose pin 4 (Reload) directly. To factory
reset, you'd need to either:

- Disassemble the RJ45 plug on the pigtail and short pins 4 and 8
  manually, or
- Make a custom RJ45 that just shorts those two pins.

Easier in practice: use the web UI's reset function while the device is
still reachable.

## A vs B swap is the most common RS-485 mistake

If after install the EW11 connects on TCP but Homebridge gets garbage data
or no data, the very first thing to try is swapping the two RS-485 wires
(A and B) in the pigtail. RS-485 is differential and the polarity matters.
There's no universal A/B convention between manufacturers — Balboa might
call its pin 3 "A" but mean what Elfin calls "B".

It's also harmless to swap and try — you can't damage anything by getting
the differential pair backwards.

## Useful diagnostic commands (run from a Mac on Endresen)

```bash
# Find EW11 by MAC on the network
arp -a | grep -i "74:e9:d8"

# Verify TCP socket is open (canonical liveness check)
nc -zv 192.168.72.43 4257

# Web UI alive (expect HTTP 401 — auth challenge)
curl -s -o /dev/null -w "%{http_code}\n" http://192.168.72.43/

# See raw spa traffic streaming (bytes from the spa)
nc 192.168.72.43 4257 | xxd

# Wide ARP scan to find any new device on .72 subnet
for i in $(seq 1 254); do ping -c 1 -W 100 -t 1 192.168.72.$i >/dev/null 2>&1 & done; wait
arp -a | grep "192.168.72" | sort -t. -k4 -n
```
