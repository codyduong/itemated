/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Sets up asynchronous communication about {@link PlayerData} between client and server using {@link RemoteEvent}
 *
 * @see {@link https://create.roblox.com/docs/reference/engine/classes/RemoteEvent RemoteEvent | Documentation - Roblox Creator Hub}
 */

import { stealOpenRetry } from "shared/server/database";
import { PlayerData } from "shared/modules/database/PlayerData";
import { Document } from "shared/modules/documentservice/DocumentService.Document";
import playerDataEvent from "shared/modules/events/PlayerDataEvent";
import playerDataDocumentStore from "shared/server/database/PlayerData";

/** Cache {@link Document documents} */
const playerIdsToDocuments: Record<number, Document<PlayerData> | undefined> = {};

let hasSetup = false;
/**
 * @throws if setup more than once
 */
export function setupPlayerDataEvent(): void {
  game.GetService("Players").PlayerAdded.Connect((player: Player) => {
    assert(hasSetup === false);
    hasSetup = true;
    print(`Retrieving PlayerData document for [id: ${player.UserId}, name: ${player.Name}]`);
    const [document, _documentCreated] = playerDataDocumentStore.GetDocument(`${player.UserId}`);

    const result = stealOpenRetry(document!);

    if (!result.success) {
      if (result.reason === "BackwardsCompatibilityError") {
        player.Kick(
          "You joined an old server which does not support your saved data. Please try joining a different server. If this issue persists, contact a developer.",
        );
      }

      if (result.reason === "RobloxAPIError") {
        player.Kick("Failed to load data due to Roblox Service issue. Try again later.");
      }

      player.Kick(`Failed to load data: ${result.reason}. Please screenshot and report this issue to a developer`);
    }

    document.HookAfter("Update", () => {
      const data = document!.GetCache();
      playerDataEvent.FireClient(player, data);
    });

    playerIdsToDocuments[player.UserId] = document;
  });

  game.GetService("Players").PlayerRemoving.Connect((player: Player) => {
    print(`Disposing PlayerData document for [id: ${player.UserId}, name: ${player.Name}]`);
    const document = playerIdsToDocuments[player.UserId];

    if (document) {
      document.Close();
      delete playerIdsToDocuments[player.UserId];
    }
  });

  playerDataEvent.OnServerEvent.Connect((player: Player) => {
    const document = playerIdsToDocuments[player.UserId];

    if (!document) {
      player.Kick("Failed to get document. Please screenshot and report this issue to a developer");
    }

    const data = document!.GetCache();
    playerDataEvent.FireClient(player, data);
  });

  game.BindToClose(() => {
    playerDataDocumentStore.CloseAllDocuments();
  });
}
