import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * OtherAccessory
 *
 * Control mister, aux1, aux2 (if they exist on your spa)
 */
export declare class OtherAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly type;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory, type: number);
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
//# sourceMappingURL=otherAccessory.d.ts.map