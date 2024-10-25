import { Tile } from "game/modules/Tile";
import { end_S_model, vertexMap } from "./model";

const tile = {
  name: "End_S",
  vertexMap: vertexMap,
  pathFrom: ["positiveZ"],
  pathTo: [],
  model: end_S_model,
  weight: 0,
} satisfies Tile;

export default tile;
