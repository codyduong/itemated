import { Tile } from "game/modules/Tile";
import { start_S_model, vertexMap } from "./model";

const tile = {
  name: "Start_S",
  vertexMap: vertexMap,
  pathFrom: [],
  pathTo: ["positiveZ"],
  model: start_S_model,
  weight: 0,
} satisfies Tile;

export default tile;
