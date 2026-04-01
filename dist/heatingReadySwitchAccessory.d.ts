import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * HeatingReadySwitchAccessory
 *
 * Turn 'Heating Always Ready' mode on ('Ready') or off ('Rest').
 */
export declare class HeatingReadySwitchAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory);
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    setOn(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    getOn(callback: CharacteristicGetCallback): void;
}
//# sourceMappingURL=heatingReadySwitchAccessory.d.ts.map