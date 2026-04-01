import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * LockAccessory
 *
 * Lock the spa settings (useful to avoid anyone messing with anything beyond basic
 * control of pumps, lights, etc) and/or the entire spa panel of controls (which stops anyone
 * from doing anything with the panel, unless they know how to unlock it).
 */
export declare class LockAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly entireSpa;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory, entireSpa: boolean);
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    setLockedOn(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
  
     */
    getLockedOn(callback: CharacteristicGetCallback): void;
}
//# sourceMappingURL=lockAccessory.d.ts.map