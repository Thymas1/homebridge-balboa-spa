import type { PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * A thermostat temperature control for the Spa.
 *
 * It looks like it might be possible to move the Flow sensor to a pair of "Filter Condition",
 * "Filter life" settings on the thermostat. Might be a slightly better fit for Homekit's approach.
 * At least we could have a "change soon" indicator on the thermostat alerting the user.
 * See https://developer.apple.com/documentation/homekit/hmcharacteristictypefilterlifelevel and
 * related topics.
 */
export declare class ThermostatAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory);
    setTargetTempMinMax(): void;
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
     * this.service.updateCharacteristic(this.platform.Characteristic.get, true)
     */
    getCurrentTemperature(callback: CharacteristicGetCallback): void;
    getTemperatureDisplayUnits(callback: CharacteristicGetCallback): void;
    getHeatingState(callback: CharacteristicGetCallback): void;
    getTargetHeatingState(callback: CharacteristicGetCallback): void;
    setTargetHeatingState(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
    getTargetTemperature(callback: CharacteristicGetCallback): void;
    setTargetTemperature(value: CharacteristicValue, callback: CharacteristicSetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
}
//# sourceMappingURL=thermostatAccessory.d.ts.map