import { Tile } from "game/modules/Tile";
import { forward_E_model, vertexMap } from "./model";

const tile = {
  name: "Forward_E",
  vertexMap: vertexMap,
  pathFrom: ["negativeX"],
  pathTo: ["positiveX"],
  model: forward_E_model,
} satisfies Tile;

export default tile;
