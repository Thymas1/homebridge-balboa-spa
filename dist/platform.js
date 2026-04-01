"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaHomebridgePlatform = void 0;
const settings_1 = require("./settings");
const pumpAccessory_1 = require("./pumpAccessory");
const lightsAccessory_1 = require("./lightsAccessory");
const temperatureAccessory_1 = require("./temperatureAccessory");
const thermostatAccessory_1 = require("./thermostatAccessory");
const waterFlowProblemAccessory_1 = require("./waterFlowProblemAccessory");
const holdSwitchAccessory_1 = require("./holdSwitchAccessory");
const lockAccessory_1 = require("./lockAccessory");
const heatingReadySwitchAccessory_1 = require("./heatingReadySwitchAccessory");
const blowerAccessory_1 = require("./blowerAccessory");
const otherAccessory_1 = require("./otherAccessory");
const spaClient_1 = require("./spaClient");
const discovery_1 = require("./discovery");
/**
 * SpaHomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class SpaHomebridgePlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        // this is used to track restored cached accessories
        this.accessories = [];
        this.connectionProblem = new Error('Connecting...');
        this.scheduleId = undefined;
        this.recordedActions = [];
        if (!config) {
            log.warn('No configuration found for %s', settings_1.PLUGIN_NAME);
        }
        this.log.debug('Finished initializing platform:', this.config.name);
        this.devices = config.devices || [];
        this.deviceObjects = new Array();
        this.spa = undefined;
        // If the user has specified the model name, use that.
        this.name = config.name;
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on("didFinishLaunching" /* APIEvent.DID_FINISH_LAUNCHING */, () => {
            log.debug('Executed didFinishLaunching callback');
            // run the method to discover / register your devices as accessories
            this.discoverDevices();
        });
        if (config.host && config.host.length > 0) {
            // The user provided the IP address in the config
            this.haveAddressOfSpa(config.devMode, config.host);
        }
        else {
            // We'll go out and find it automatically
            (0, discovery_1.discoverSpas)(log, this.haveAddressOfSpa.bind(this, config.devMode));
        }
        this.api.on("shutdown" /* APIEvent.SHUTDOWN */, () => {
            log.debug('Closing down homebridge - closing our connection to the Spa...');
            if (this.spa) {
                this.spa.shutdownSpaConnection();
            }
        });
    }
    haveAddressOfSpa(devMode, ipAddress) {
        if (this.spa) {
            this.log.error('Already have a spa set up. If you wish to control two or more Spas, please file a bug report.');
            return;
        }
        // Create and load up our primary client which connects with the spa
        this.spa = new spaClient_1.SpaClient(this.log, ipAddress, this.spaConfigurationKnown.bind(this), this.updateStateOfAccessories.bind(this), this.executeAllRecordedActions.bind(this), devMode);
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        this.log.info('Restoring accessory from cache:', accessory.displayName);
        this.makeAccessory(accessory);
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    /**
     * Called once we have received a message from the spa containing the
     * accurate configuration of number of pumps (and their speed ranges),
     * lights, etc.
     */
    spaConfigurationKnown() {
        if (this.config.autoCreateAccessories) {
            // Make sure we create all devices before we try to accurately
            // configure them all.
            this.discoverDevices();
        }
        this.log.debug('Spa configuration known - informing each accessory');
        this.deviceObjects.forEach(deviceObject => {
            deviceObject.spaConfigurationKnown();
        });
    }
    /**
     * This is a callback which is triggered when the Spa code discovers that something has changed in
     * the spa state, where that change might have happened outside of Home. In such a case we need to
     * make sure all accessories are resynced. This resync operation is lightweight (no spa communication
     * needed) and fast. It may lead to Home's knowledge of the state of each accessory changing.
     *
     * The only challenge is that this call might be triggered while changes are already
     * being sent to the spa, so we want to wait for any changes to play out before
     * checking the spa's state and updating everything.
     */
    updateStateOfAccessories() {
        if (this.scheduleId) {
            clearTimeout(this.scheduleId);
            this.scheduleId = undefined;
        }
        // Allow 250ms leeway for another state change event.
        this.scheduleId = setTimeout(() => {
            this.reallyUpdateStateOfAccessories();
            this.scheduleId = undefined;
        }, 250);
    }
    reallyUpdateStateOfAccessories() {
        this.log.debug("State of something changed - tell HomeKit about it.");
        // For the moment, we simply loop through every device updating homekit.
        // At least theoretically better if we could just do the ones we know have changed.
        this.deviceObjects.forEach(deviceObject => {
            deviceObject.updateCharacteristics();
        });
    }
    status() {
        if (this.isCurrentlyConnected()) {
            return "(connected)";
        }
        else {
            return "(not currently connected)";
        }
    }
    isCurrentlyConnected() {
        return this.spa ? this.spa.hasGoodSpaConnection() : false;
    }
    recordAction(func) {
        this.log.info('Recording action for later:', func);
        this.recordedActions.push(func);
    }
    executeAllRecordedActions() {
        const loggingCallback = (foo) => {
            this.log.info('Replayed action called back with:', foo);
        };
        while (this.isCurrentlyConnected() && this.recordedActions.length > 0) {
            const func = this.recordedActions.shift();
            this.log.info('Replaying an action:', func);
            func(loggingCallback);
        }
    }
    /**
     * We get all accessories either from the spa itself or from the config.json file.
      */
    discoverDevices() {
        if (this.config.autoCreateAccessories && this.spa && this.spa.accurateConfigReadFromSpa) {
            this.log.info('Autocreating accessories...');
            if (this.spa.getIsLightOn(1) != undefined)
                this.makeDevice({ name: 'Spa Lights 1', deviceType: 'Lights 1' });
            if (this.spa.getIsLightOn(2) != undefined)
                this.makeDevice({ name: 'Spa Lights 2', deviceType: 'Lights 2' });
            for (let pump = 1; pump <= 6; pump++) {
                if (this.spa.getPumpSpeedRange(pump) != 0)
                    this.makeDevice({ name: 'Spa Pump ' + pump, deviceType: 'Pump ' + pump });
            }
            if (this.spa.getPumpSpeedRange(0) != 0)
                this.makeDevice({ name: 'Spa Circulation Pump', deviceType: 'Circulation Pump' });
            this.makeDevice({ name: 'Spa Temperature Sensor', deviceType: 'Temperature Sensor' });
            this.makeDevice({ name: 'Spa Thermostat', deviceType: 'Thermostat' });
            this.makeDevice({ name: 'Spa Flow', deviceType: 'Water Flow Problem Sensor' });
            this.makeDevice({ name: 'Hold Spa', deviceType: 'Hold Switch' });
            this.makeDevice({ name: 'Spa Settings', deviceType: 'Spa Settings' });
            this.makeDevice({ name: 'Spa Panel', deviceType: 'Spa Panel' });
            this.makeDevice({ name: 'Spa Heat Mode Ready', deviceType: 'Spa Heat Mode Ready' });
            if (this.spa.getBlowerSpeedRange() != 0)
                this.makeDevice({ name: 'Spa Blower', deviceType: 'Blower' });
            if (this.spa.getIsMisterOn() != undefined)
                this.makeDevice({ name: 'Spa Mister', deviceType: 'Mister' });
            if (this.spa.getIsAuxOn(1) != undefined)
                this.makeDevice({ name: 'Spa Aux 1', deviceType: 'Aux 1' });
            if (this.spa.getIsAuxOn(2) != undefined)
                this.makeDevice({ name: 'Spa Aux 2', deviceType: 'Aux 2' });
        }
        for (const device of this.devices) {
            if (!device.deviceType) {
                this.log.warn('Device Type Missing');
            }
            else {
                this.makeDevice(device);
            }
        }
    }
    /**
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    makeDevice(device) {
        // generate a unique id for the accessory this should be generated from
        // something globally unique, but constant, for example, the device serial
        // number or MAC address
        const uuid = this.api.hap.uuid.generate(device.deviceType);
        // check that the device has not already been registered by checking the
        // cached devices we stored in the `configureAccessory` method above
        if (!this.accessories.find(accessory => accessory.UUID === uuid)) {
            this.log.info('Registering new accessory:', device.name, 'of type', device.deviceType);
            // create a new accessory
            const accessory = new this.api.platformAccessory(device.name, uuid);
            // store a copy of the device object in the `accessory.context`
            // the `context` property can be used to store any data about the accessory you may need
            accessory.context.device = device;
            this.makeAccessory(accessory);
            // link the accessory to your platform
            this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
            // push into accessory cache
            this.accessories.push(accessory);
            // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
            // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
            // If we do this, we should also remove them from the deviceObjects array.
        }
    }
    /*
     * Here we make our Spa accessory to fit with the generic platformAccessory provided, which has
     * relevant details in 'device'
     */
    makeAccessory(accessory) {
        const deviceType = accessory.context.device.deviceType;
        switch (deviceType) {
            case "Circulation Pump": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 0));
                break;
            }
            case "Pump 1": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 1));
                break;
            }
            case "Pump 2": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 2));
                break;
            }
            case "Pump 3": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 3));
                break;
            }
            case "Pump 4": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 4));
                break;
            }
            case "Pump 5": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 5));
                break;
            }
            case "Pump 6": {
                this.deviceObjects.push(new pumpAccessory_1.PumpAccessory(this, accessory, 6));
                break;
            }
            case "Lights 1": {
                this.deviceObjects.push(new lightsAccessory_1.LightsAccessory(this, accessory, 1));
                break;
            }
            case "Lights 2": {
                this.deviceObjects.push(new lightsAccessory_1.LightsAccessory(this, accessory, 2));
                break;
            }
            case "Temperature Sensor": {
                this.deviceObjects.push(new temperatureAccessory_1.TemperatureAccessory(this, accessory));
                break;
            }
            case "Thermostat": {
                this.deviceObjects.push(new thermostatAccessory_1.ThermostatAccessory(this, accessory));
                break;
            }
            case "Water Flow Problem Sensor": {
                this.deviceObjects.push(new waterFlowProblemAccessory_1.WaterFlowProblemAccessory(this, accessory));
                break;
            }
            case "Hold Switch": {
                this.deviceObjects.push(new holdSwitchAccessory_1.HoldSwitchAccessory(this, accessory));
                break;
            }
            case "Spa Settings": {
                this.deviceObjects.push(new lockAccessory_1.LockAccessory(this, accessory, false));
                break;
            }
            case "Spa Panel": {
                this.deviceObjects.push(new lockAccessory_1.LockAccessory(this, accessory, true));
                break;
            }
            case "Spa Heat Mode Ready": {
                this.deviceObjects.push(new heatingReadySwitchAccessory_1.HeatingReadySwitchAccessory(this, accessory));
                break;
            }
            case "Blower": {
                this.deviceObjects.push(new blowerAccessory_1.BlowerAccessory(this, accessory));
                break;
            }
            case "Mister": {
                this.deviceObjects.push(new otherAccessory_1.OtherAccessory(this, accessory, 0));
                break;
            }
            case "Aux 1": {
                this.deviceObjects.push(new otherAccessory_1.OtherAccessory(this, accessory, 1));
                break;
            }
            case "Aux 2": {
                this.deviceObjects.push(new otherAccessory_1.OtherAccessory(this, accessory, 2));
                break;
            }
            default: {
                this.log.warn('Unknown accessory type', deviceType);
            }
        }
    }
}
exports.SpaHomebridgePlatform = SpaHomebridgePlatform;
//# sourceMappingURL=platform.js.map