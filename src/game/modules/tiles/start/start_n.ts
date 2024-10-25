import { Tile } from "game/modules/Tile";
import { start_N_model, vertexMap } from "./model";

const tile = {
  name: "Start_N",
  vertexMap: vertexMap,
  pathFrom: [],
  pathTo: ["negativeZ"],
  model: start_N_model,
  weight: 0,
} satisfies Tile;

export default tile;
