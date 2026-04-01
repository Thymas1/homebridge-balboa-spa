/// <reference types="node" />
import type { Logger } from 'homebridge';
import * as net from "net";
export declare const FLOW_GOOD = "Good";
export declare const FLOW_LOW = "Low";
export declare const FLOW_FAILED = "Failed";
export declare const FLOW_STATES: string[];
export declare class SpaClient {
    readonly log: Logger;
    readonly host: string;
    readonly spaConfigurationKnownCallback: () => void;
    readonly changesCallback: () => void;
    readonly reconnectedCallback: () => void;
    socket?: net.Socket;
    lightIsOn: (boolean | undefined)[];
    pumpsCurrentSpeed: number[];
    pumpsSpeedRange: number[];
    blowerCurrentSpeed: (number | undefined);
    blowerSpeedRange: number;
    auxIsOn: (boolean | undefined)[];
    misterIsOn: (boolean | undefined);
    temp_CorF: string;
    currentTemp?: number;
    targetTempModeHigh?: number;
    targetTempModeLow?: number;
    tempRangeIsHigh: boolean;
    hour: number;
    minute: number;
    heatingMode: string;
    priming: boolean;
    time_12or24: string;
    isHeatingNow: boolean;
    hasCirculationPump: boolean;
    circulationPumpIsOn: boolean;
    filtering: number;
    lockTheSettings: boolean;
    lockTheEntirePanel: boolean;
    hold: boolean;
    receivedStateUpdate: boolean;
    autoSetSpaClock: boolean;
    private reconnectDelay;
    private connectTimeoutId;
    flow: string;
    accurateConfigReadFromSpa: boolean;
    private isCurrentlyConnectedToSpa;
    numberOfConnectionsSoFar: number;
    liveSinceDate: Date;
    faultCheckIntervalId: any;
    stateUpdateCheckIntervalId: any;
    keepalivePingIntervalId: any;
    preventiveReconnectIntervalId: any;
    devMode: boolean;
    firmwareVersion: string;
    systemModel: string;
    lastStateBytes: Uint8Array;
    lastFaultBytes: Uint8Array;
    temperatureHistory: (number | undefined)[];
    constructor(log: Logger, host: string, spaConfigurationKnownCallback: () => void, changesCallback: () => void, reconnectedCallback: () => void, devMode?: boolean);
    get_socket(host: string): net.Socket;
    successfullyConnectedToSpa(): void;
    lastIncompleteChunk: (Uint8Array | undefined);
    lastChunkTimestamp: (Date | undefined);
    /**
     * We got some data from the Spa. Often one "chunk" exactly equals one message.
     * But sometimes a single chunk will contain multiple messages back to back, and
     * so we need to process each in turn. And sometimes a chunk will not contain a full
     * message - it is incomplete - and we should store it and wait for the rest to
     * arrive (or discard it if the rest doesn't arrive).
     *
     * @param chunk
     */
    readAndActOnSocketContents(chunk: Uint8Array): number;
    private missedStateChecks;
    private successfulStateChecks;
    checkWeHaveReceivedStateUpdate(): void;
    reconnecting: boolean;
    reconnect(host: string): void;
    shutdownSpaConnection(): void;
    hasGoodSpaConnection(): boolean;
    recordTemperatureHistory(): void;
    /**
     * Message starts and ends with 0x7e. Needs a checksum.
     * @param purpose purely for logging clarity
     * @param type
     * @param payload
     */
    sendMessageToSpa(purpose: string, type: Uint8Array, payload: Uint8Array): void;
    /**
     * Turn the bytes into a nice hex, comma-separated string like '0a,bf,2e'
     * @param message the bytes
     */
    prettify(message: Uint8Array): RegExpMatchArray | null;
    getTargetTemp(): number;
    getTempIsCorF(): string;
    convertTempToC(temp: number): number | undefined;
    convertTempFromC(temp: number): number | undefined;
    getTempRangeIsHigh(): boolean;
    timeToString(hour: number, minute: number): string;
    getIsLightOn(index: number): boolean | undefined;
    setMisterState(value: boolean): void;
    getIsMisterOn(): boolean | undefined;
    setAuxState(index: number, value: boolean): void;
    getIsAuxOn(index: number): boolean | undefined;
    getIsHold(): boolean;
    setIsHold(value: boolean): void;
    getIsLocked(entirePanel: boolean): boolean;
    setIsLocked(entirePanel: boolean, value: boolean): void;
    getIsHeatingNow(): boolean;
    getHeatingMode(): string;
    isHeatingModeAlwaysReady(): boolean;
    /**
     * Boolean either
     * - 'ready' (always heating if needed) or
     * - 'rest' (only heating when a pump is running)
     *
     * In winter it is advisable to keep the spa in ready mode (at a low temperature if preferred)
     * to avoid freezing.
     */
    setHeatingModeAlwaysReady(isAlwaysReady: boolean): void;
    /**
     * Returns in C or F depending on what the user has defined in the Spa
     * control panel.
     */
    getCurrentTemp(): number | undefined;
    setLightState(index: number, value: boolean): void;
    setTempRangeIsHigh(isHigh: boolean): void;
    getFlowState(): string;
    getPumpSpeedRange(index: number): number;
    static getSpeedAsString(range: number, speed: number): string | undefined;
    getPumpSpeed(index: number): number;
    getBlowerSpeedRange(): number;
    getBlowerSpeed(): number;
    setBlowerSpeed(desiredSpeed: number): void;
    /**
     * A complication here is that, during filtration cycles, a pump might be locked into an "on"
     * state.  For example on my Spa, pump 1 goes into "low" state, and I can switch it to "high", but
     * a toggle from "high" does not switch it off, but rather switches it straight to "low" again.
     * With single-speed pumps this isn't such an issue, but with 2-speed pumps, this behaviour causes
     * problems for the easiest approach to setting the pump to a particular speed.  When we calculate that
     * two 'toggles' are needed, the reality is that sometimes it might just be one, and hence two
     * toggles will end us in the wrong pump speed.  There are really just two specific case that are
     * annoying as a user:
     *
     * 1) the pump is "High". Desired speed is "Low". Hence we deduce the need for
     * two toggles. But, since "Off" is skipped, we end up back where we started in "High".
     *
     * 2) we're trying to turn the pump off, but it can't be turned off. We need to make sure
     * the ending state is correctly reflected in Home.
     *
     * @param index pump number (1-6) convert to index lookup (0-5) convert to Balboa message id (4-9)
     * @param desiredSpeed 0...pumpsSpeedRange[index] depending on speed range of the pump
     */
    setPumpSpeed(index: number, desiredSpeed: number): void;
    compute_checksum(length: Uint8Array, bytes: Uint8Array): number;
    concat(a: Uint8Array, b: Uint8Array): Uint8Array;
    setTargetTemperature(temp: number): void;
    checkAndSetTimeOfDay(): void;
    send_config_request(): void;
    sendControlTypesRequest(): void;
    sendControlPanelRequest(id: number): void;
    send_request_for_faults_log(): void;
    /**
     * Most of the Spa's controls are "toggles" - i.e. we don't set a pump to a specific
     * speed, or turn a light on, but rather we increment or toggle the state of a device,
     * so the same action turns a light on as off, and to get a 2-speed pump from off to high
     * we need to toggle it twice.  Here are the known codes:
     *  - 0x04 to 0x09 - pumps 1-6
     *  - 0x11-0x12 - lights 1-2
     *  - 0x3c - hold. Hold mode is used to disable the pumps during service
     *  functions like cleaning or replacing the filter.  Hold mode will last for 1 hour
     *  unless the mode is exited manually.
     *  - 0x50 - temperature range (high or low)
     *  - 0x0c - blower
     *  - 0x0e - mister
     *  - 0x16 - aux1
     *  - 0x17 - aux2
     *  - 0x51 - heating mode (ready = always trying to maintain temperature, rest = only
     *           heat when pumps are running)
     *
     *  The spa may also have two "lock" settings - locking the control panel completely, or
     *  just locking the settings (but allowing jets and lights, say, to still be used). Those
     *  are set below in 'send_lock_settings' and do not use the toggle mechanism.
     */
    send_toggle_message(itemName: string, code: number): void;
    send_lock_settings(entirePanel: boolean, lock: boolean): void;
    convertSpaTemperatureToExternal(temperature: number): number;
    convertExternalTemperatureToSpa(temperature: number): number;
    internalTemperatureToString(temperature?: number): string;
    stateToString(): string;
    /**
     * Return true if anything in the state has changed as a result of the message
     * received.
     *
     * @param length
     * @param checksum
     * @param chunk - first and last bytes are 0x7e. Second byte is message length.
     * Second-last byte is the checksum.  Then bytes 3,4,5 are the message type.
     * Everything in between is the content.
     */
    readAndActOnMessage(length: number, checksum: number, chunk: Uint8Array): boolean;
    /**
     * By resetting our knowledge of recent state, we ensure the next time the spa reports
     * its state, that we broadcast that to Homekit as an update. This is useful whenever
     * we have reason to believe the state might be out of sync. We therefore use it for
     * two purposes: (a) immediately after a (re)connection with the spa, (b) when we try
     * to turn a pump off, but believe it might not be allowed to be off.
     */
    resetRecentState(): void;
    /**
     * Interpret the standard response, which we are sent about every 1 second, covering
     * all of the primary state of the spa.
     *
     * Return true if anything important has changed (e.g. ignore the time changing!)
     */
    readStateFromBytes(bytes: Uint8Array): boolean;
    internalSetPumpSpeed(range: number, value: number): number;
    /**
     * Get the set of accessories on this spa - how many pumps, lights, etc.
     *
     * @param bytes 1a(=00011010),00,01,90,00,00 on my spa
     */
    interpretControlTypesReply(bytes: Uint8Array): boolean;
    /**
     * Information returned from calls 1-4 here. Results shown below for my Spa.
     *
     * 1: Filters: 14,00,01,1e,88,00,01,1e
     * - Bytes0-3: Filter start at 20:00, duration 1 hour 30 minutes
     * - Bytes4-7: Filter also start 8:00am (high-order bit says it is on), duration 1 hour 30 minutes
     * 2: 64,e1,24,00,4d,53,34,30,45,20,20,20,01,c3,47,96,36,03,0a,44,00
     * - First three bytes are the software id.
     * - Bytes 5-12 (4d,53,34,30,45,20,20,20) are the motherboard model in ascii
     *   which is MS40E in this case (SIREV16 is a value reported by another user).
     * - After that comes 1 byte for 'current setup' and then 4 bytes which encode
     * the 'configuration signature'.
     * 3: Results for various people:
     * 05,01,32,63,50,68,61,07,41 <- mine
     * 12,11,32,63,50,68,61,03,41
     * 12,04,32,63,50,68,29,03,41
     * 04,01,32,63,3c,68,08,03,41
     * - No idea?! ' cPha' is the ascii version of my middle 5 bytes - so probably not ascii!
     * 4: Reminders, cleaning cycle length, etc.: 00,85,00,01,01,02,00,00,00,00,00,00,00,00,00,00,00,00
     * - first 01 = temp scale (F or C)
     * - next 01 = time format (12hour or 24hour)
     * - 02 = cleaning cycle length in half hour increments
     *
     * Mostly we don't choose to use any of the above information at present.
     *
     * @param id
     * @param contents
     */
    interpretControlPanelReply(id: number, contents: Uint8Array): boolean;
    /**
     * 	Get log of faults. Return true if there were faults of relevance which require a
     *  homekit state change
     */
    readFaults(bytes: Uint8Array): boolean;
    equal(one: Uint8Array, two: Uint8Array): boolean;
    /**
     * All fault codes I've found on the internet, e.g. in balboa spa manuals
     *
     * @param code
     */
    faultCodeToString(code: number): "sensors may be out of sync" | "the water flow is low" | "the water flow has failed" | "priming (this is not actually a fault - your Spa was recently turned on)" | "the clock has failed" | "the settings have been reset (persistent memory error)" | "program memory failure" | "sensors are out of sync -- call for service" | "the heater is dry" | "the heater may be dry" | "the water is too hot" | "the heater is too hot" | "sensor A fault" | "sensor B fault" | "safety trip - pump suction blockage" | "a pump may be stuck on" | "hot fault" | "the GFCI test failed" | "hold mode activated (this is not actually a fault)" | "unknown code - check Balboa spa manuals";
}
//# sourceMappingURL=spaClient.d.ts.map