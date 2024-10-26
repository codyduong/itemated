/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Executes wave function collapse in parallel luau runtime
 *
 * - https://create.roblox.com/docs/scripting/multithreading
 */

import { WaveFunctionCollapse } from "game/modules/WFC";

script.GetActor()!.BindToMessageParallel("Fire", () => {
  // while (true) {
  //   const wfc = new WaveFunctionCollapse({ x: 12, y: 1, z: 12 });
  //   const p = wfc.collapse();
  //   // wfc.setupStartAndEnd();
  //   task.synchronize();
  //   wfc.show();
  //   task.wait(0.5);
  // }
  const wfc = new WaveFunctionCollapse({ x: 12, y: 1, z: 12, pathLength: 16, horizontalPadding: 2 });
  let [result, msg] = [false, ""];
  while (result === false) {
    if (msg !== "") {
      print("Failed to generate because: ");
      print(msg);
      print("retrying...");
    }
    [result, msg] = pcall(() => wfc.collapse()) as LuaTuple<[boolean, string]>;
    wait();
  }
  task.synchronize();
  wfc.show();
});
