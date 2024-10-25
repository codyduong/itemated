import { Tile } from "game/modules/Tile";
import { end_E_model, vertexMap } from "./model";

const tile = {
  name: "End_E",
  vertexMap: vertexMap,
  pathFrom: ["positiveX"],
  pathTo: [],
  model: end_E_model,
  weight: 0,
} satisfies Tile;

export default tile;
