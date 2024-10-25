import { Tile } from "game/modules/Tile";
import { turnR_E_model, vertexMap } from "./model";

const tile = {
  name: "TurnR_E",
  vertexMap: vertexMap,
  pathFrom: ["negativeX"],
  pathTo: ["positiveZ"],
  model: turnR_E_model,
} satisfies Tile;

export default tile;
