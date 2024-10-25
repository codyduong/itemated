import { Tile } from "game/modules/Tile";
import { end_N_model, vertexMap } from "./model";

const tile = {
  name: "End_N",
  vertexMap: vertexMap,
  pathFrom: ["negativeZ"],
  pathTo: [],
  model: end_N_model,
  weight: 0,
} satisfies Tile;

export default tile;
