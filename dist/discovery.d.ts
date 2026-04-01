import type { Logger } from 'homebridge';
/**
 * Try to find a Spa on the network automatically, using UDP broadcast
 * @param log
 * @param foundSpaCallback call with the ip address of any Spa found on the network
 */
export declare function discoverSpas(log: Logger, foundSpaCallback: (ip: string) => void): void;
//# sourceMappingURL=discovery.d.ts.map