/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Contains utility functionality for server events
 */

import { setupRegenerateMap } from "./RegenerateMap";

/**
 * Simply setup all events for the server
 *
 * IE. setup async server/client communication
 *
 * @throws If called more than once on a server
 */
export default function setupEvents() {
  setupRegenerateMap();
}