import { Tile } from "game/modules/Tile";
import { turnL_E_model, vertexMap } from "./model";

const tile = {
  name: "TurnL_E",
  vertexMap: vertexMap,
  pathFrom: ["negativeX"],
  pathTo: ["negativeZ"],
  model: turnL_E_model,
} satisfies Tile;

export default tile;
