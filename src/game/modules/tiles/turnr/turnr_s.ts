import { Tile } from "game/modules/Tile";
import { turnR_S_model, vertexMap } from "./model";

const tile = {
  name: "TurnR_S",
  vertexMap: vertexMap,
  pathFrom: ["negativeZ"],
  pathTo: ["negativeX"],
  model: turnR_S_model,
} satisfies Tile;

export default tile;
