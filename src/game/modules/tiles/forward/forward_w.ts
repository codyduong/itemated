import { Tile } from "game/modules/Tile";
import { forward_W_model, vertexMap } from "./model";

const tile = {
  name: "Forward_W",
  vertexMap: vertexMap,
  pathFrom: ["positiveX"],
  pathTo: ["negativeX"],
  model: forward_W_model,
} satisfies Tile;

export default tile;
