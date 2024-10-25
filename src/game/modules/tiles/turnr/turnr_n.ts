import { Tile } from "game/modules/Tile";
import { turnR_N_model, vertexMap } from "./model";

const tile = {
  name: "TurnR_N",
  vertexMap: vertexMap,
  pathFrom: ["positiveZ"],
  pathTo: ["positiveX"],
  model: turnR_N_model,
} satisfies Tile;

export default tile;
