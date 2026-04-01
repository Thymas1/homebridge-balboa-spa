import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * HoldSwitchAccessory
 *
 * Turn 'hold' mode on or off. Used when cleaning filters, etc, to temporarily turn all
 * pumps (including circulation pump) off.
 */
export declare class HoldSwitchAccessory {
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
     *
     * GET requests should return as fast as possbile. A long delay here will result in
     * HomeKit being unresponsive and a bad user experience in general.
     *
     * If your device takes time to respond you should update the status of your device
     * asynchronously instead using the `updateCharacteristic` method instead.
  
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    getOn(callback: CharacteristicGetCallback): void;
}
//# sourceMappingURL=holdSwitchAccessory.d.ts.map