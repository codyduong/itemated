import { Tile } from "game/modules/Tile";
import { start_E_model, vertexMap } from "./model";

const tile = {
  name: "Start_E",
  vertexMap: vertexMap,
  pathFrom: [],
  pathTo: ["positiveX"],
  model: start_E_model,
  weight: 0,
} satisfies Tile;

export default tile;
