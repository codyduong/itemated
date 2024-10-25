import { Tile } from "game/modules/Tile";
import { end_W_model, vertexMap } from "./model";

const tile = {
  name: "End_W",
  vertexMap: vertexMap,
  pathFrom: ["negativeX"],
  pathTo: [],
  model: end_W_model,
  weight: 0,
} satisfies Tile;

export default tile;
