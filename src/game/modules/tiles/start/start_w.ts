import { Tile } from "game/modules/Tile";
import { start_W_model, vertexMap } from "./model";

const tile = {
  name: "Start_W",
  vertexMap: vertexMap,
  pathFrom: [],
  pathTo: ["negativeX"],
  model: start_W_model,
  weight: 0,
} satisfies Tile;

export default tile;
