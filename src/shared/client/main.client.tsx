/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file
 *
 * This code is compiled and executed in all places on the client
 *
 * In this particular case this is used for instantiating two GUIs
 * - PlayerHeadGui is the GUI above any one player's head and lives in 3D space
 * - ScreenGui is the overall experience GUI which lives in 2D space.
 *
 * GUIs are built using {@link https://github.com/Roblox/react-lua | react-lua}
 *
 */

import React, { StrictMode } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import PlayersContext from "shared/client/gui/contexts/PlayersContext";
import PlayerHeadGui from "shared/client/gui/playerhead";
import ScreenGui from "shared/client/gui/screen";
import PlayerDataContext from "./gui/contexts/PlayerDataContext";

let root = createRoot(new Instance("Folder"));
root.render(
  <StrictMode>
    <PlayersContext>
      <PlayerDataContext>
        <PlayerHeadGui />
        <ScreenGui />
      </PlayerDataContext>
    </PlayersContext>
  </StrictMode>,
);
