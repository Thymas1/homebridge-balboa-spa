import type { PlatformAccessory, CharacteristicGetCallback } from 'homebridge';
import { SpaHomebridgePlatform } from './platform';
/**
 * WaterFlowProblemAccessory
 *
 * We create a water flow monitor as a Homekit LeakSensor to tell us if there's a problem
 * with the water flow in the heating system of the hot tub.  At least in my experience
 * this is the most common, easily resolvable, but annoying problem that can occur. The
 * earlier you are notified (hence Home integration), the less troubling it is.
 */
export declare class WaterFlowProblemAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    constructor(platform: SpaHomebridgePlatform, accessory: PlatformAccessory);
    handleLeakDetectedGet(callback: CharacteristicGetCallback): void;
    handleFaultDetectedGet(callback: CharacteristicGetCallback): void;
    spaConfigurationKnown(): void;
    updateCharacteristics(): void;
}
//# sourceMappingURL=waterFlowProblemAccessory.d.ts.map