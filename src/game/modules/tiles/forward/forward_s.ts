import { Tile } from "game/modules/Tile";
import { forward_S_model, vertexMap } from "./model";

const tile = {
  name: "Forward_S",
  vertexMap: vertexMap,
  pathFrom: ["negativeZ"],
  pathTo: ["positiveZ"],
  model: forward_S_model,
} satisfies Tile;

export default tile;
