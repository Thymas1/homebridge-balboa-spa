# Install Procedure (resume here)

This is the step-by-step procedure for the remaining install work. Picking up
where we paused on 2026-05-02 — the EW11 is bench-configured and verified, the
spa hardware is identified, and we're about to open the spa control box.

> **⚠️ Safety**: The Balboa BP21 board has 230V mains terminals around its
> edges. The 4-pin WiFi header itself is low-voltage (5–12V) and safe to
> probe, but everything around it on that board can kill you. Always:
>
> 1. Verify the spa breaker is **OFF** before opening the metal control box.
> 2. Wait 30 seconds for capacitors to discharge.
> 3. Dry hands, dry workspace.
> 4. When measuring with the spa **powered on**, only probe the 4-pin
>    WiFi header — do not let probes slip onto the larger screw terminals
>    or relays.

## Where we are

- The Elfin-EW11 is bench-configured and powered on the user's desk.
  Verified working at `192.168.72.43:4257`.
- Spa breaker has been turned off, equipment bay opened, BWGWIFI1 module
  located and identified. Cable still plugged into the spa main board.
- We confirmed the cable has 4 conductors (RS-485 + power) and the
  connector is a Molex Mini-Fit Jr 43020 series.
- We are ready to open the metal control box to access the main board's
  WiFi header.

## Step 1 — Open the control box and document

1. Spa breaker **OFF**, confirmed visually.
2. Wait 30 seconds.
3. Open the BP21 metal control box.
4. **Take photos**:
   - Wide shot of the entire main board for orientation.
   - Close-up of the **4-pin male header** where the BWGWIFI1 cable plugs in.
     Look for a silkscreen label like `WIFI`, `J*`, etc. near it.
   - Cable plugged in, then unplugged.

## Step 2 — Verify the pinout with a multimeter

You'll need a multimeter (DC volts mode) and the spa powered on with the
WiFi cable disconnected from the main board.

1. Confirm spa breaker is OFF, then unplug the BWGWIFI1 cable from the main
   board.
2. Close the metal control box cover (or position safely) and turn the spa
   breaker **ON**. The spa will boot up; it doesn't need the WiFi module to
   run.
3. Multimeter to **DC volts, 20V range**.
4. Black probe → spa pack metal chassis (find an unpainted screw or grounded
   metal point).
5. Red probe → each of the 4 male pins on the header in turn. **Pin numbering
   convention**: looking into the pins with the polarizing key/latch
   orientation matching the cable's connector (key on top), pins are
   numbered:
   ```
   ┌─────┬─────┐
   │  1  │  2  │
   ├─────┼─────┤
   │  3  │  4  │
   └─────┴─────┘
   ```
6. **Record the voltage on each pin**:
   - Pin reading **+12V or +5V** → V+ (power)
   - Pin reading **0V with continuity to chassis** → GND
   - Two pins reading somewhere between 1V and 5V → A and B (RS-485 idle bias)
7. Power spa **OFF** again.

> **Expected result** (community-documented standard):
> - Pin 1: +12V
> - Pin 2: GND
> - Pin 3: A+
> - Pin 4: B−
>
> If your readings differ, trust the meter, not the convention. Write down
> what you measured.

## Step 3 — Cut and identify the wires

Goal: cut the cable a few cm from the BWGWIFI1 module, preserving the
spa-side connector + most of the cable + waterproof boot, then map each
of the 4 wires to its pin.

1. Spa breaker **OFF**.
2. With cable still connected to the BWGWIFI1 module, cut the cable about
   3–5 cm from the white plastic module case. You're throwing away the
   module-side stub and keeping ~95% of the cable + the spa connector.
3. Strip ~7 mm of insulation off each of the 4 wires.
4. **Continuity-test each wire to each connector pin** to map them. With
   multimeter in continuity/buzz mode:
   - Touch one probe to a connector pin (numbered as in step 2).
   - Touch the other probe to each stripped wire end in turn.
   - The wire that beeps = the wire connected to that pin.
   - Record the mapping. Mark each wire with a piece of tape or sharpie
     stripe so you don't lose track.
5. After all 4 wires are mapped, you should have something like:
   ```
   Wire A (taped 'V+')  → Pin 1 → +12V
   Wire B (taped 'GND') → Pin 2 → GND
   Wire C (taped 'A')   → Pin 3 → A+
   Wire D (taped 'B')   → Pin 4 → B−
   ```

## Step 4 — Wire to the EW11 pigtail

The pigtail screw terminals (left to right when right-side-up, looking at
the labels):

| Hole | Top label | Function |
|------|-----------|----------|
| 1    | A         | RS-485 + |
| 2    | +         | V+ (5–36 VDC) |
| 3    | −         | V− / GND |
| 4    | B         | RS-485 − |

So wire the spa cable into the pigtail like this:

| Spa cable wire | Pigtail terminal |
|----------------|------------------|
| V+ (Pin 1)     | `+` (hole 2) |
| GND (Pin 2)    | `−` (hole 3) |
| A+ (Pin 3)     | `A` (hole 1) |
| B− (Pin 4)     | `B` (hole 4) |

Steps:

1. Loosen the 4 screws a couple turns each.
2. Insert each wire into its labeled hole.
3. Tighten each screw firmly.
4. Tug-test each wire — should not pull out.
5. Use heat-shrink or electrical tape to insulate any exposed conductor
   between the screw block and the cable jacket.

## Step 5 — Remove the BWGWIFI1 module (or leave it dangling)

The BWGWIFI1 white plastic module is now disconnected from the system.
You can:

- **Cut its cable stub clean** and put the module in a drawer as a
  known-good fallback.
- Or leave it zip-tied where it is, just disconnected — depending on
  cable management preferences.

Mark the module clearly with a note like: *"Replaced 2026-XX-XX with
Elfin-EW11. Pinout: P1=V+, P2=GND, P3=A+, P4=B− (or whatever you
measured)."* So future-you doesn't have to reverse-engineer it again
if you ever want to put it back.

## Step 6 — Mount and connect the EW11

1. Find a **dry mounting spot** in the equipment bay — top of the bay,
   away from any drip path. The EW11 has a metal case but the antenna
   joint and screw terminals are not waterproof.
2. Velcro / zip-tie / 3M-tape the EW11 in position.
3. Plug the pigtail's RJ45 into the EW11.
4. Plug the cable's spa connector back into the spa main board's WiFi
   header.
5. Route the cable so it doesn't get pinched, isn't near hot surfaces,
   and has some slack at both ends.

## Step 7 — Power on and verify

1. Close the metal control box.
2. Spa breaker **ON**.
3. Within ~30 seconds, the EW11 should boot and join `Endresen`. From a
   Mac on the same network:
   ```bash
   nc -zv 192.168.72.43 4257
   ```
   Should report `succeeded`.
4. From the Homebridge Pi (`goddo` at `192.168.72.223`), restart Homebridge:
   ```bash
   sudo systemctl restart homebridge
   ```
   Then watch the logs:
   ```bash
   sudo journalctl -fu homebridge
   ```
   You should see the plugin connect to the spa, identify accessories,
   and start reporting state.

## If something goes wrong

- **EW11 never appears at `192.168.72.43`**: see TROUBLESHOOTING.md → "STA
  WiFi connection issues".
- **EW11 reachable but plugin can't talk to spa**: verify A/B aren't swapped.
  RS-485 polarity is the most common bug. Try swapping the two wires.
- **Plugin connects but no data flows**: spa baud rate mismatch (we set
  115200; if the spa wants something different, no data). Re-check the
  serial settings on the EW11.
- **Plugin connects, sometimes works, sometimes doesn't**: usually grounding
  or marginal connections. Check screw terminals are tight. Check no
  whisker of stripped wire is shorting between adjacent terminals.

After successful install, **update `CLAUDE.md`** to remove the "currently
the original Balboa WiFi module" reference and replace with EW11 info.
