import { Tile } from "game/modules/Tile";
import { forward_N_model, vertexMap } from "./model";

const tile = {
  name: "Forward_N",
  vertexMap: vertexMap,
  pathFrom: ["positiveZ"],
  pathTo: ["negativeZ"],
  model: forward_N_model,
} satisfies Tile;

export default tile;
