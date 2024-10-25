import { Tile } from "game/modules/Tile";
import { turnL_N_model, vertexMap } from "./model";

const tile = {
  name: "TurnL_N",
  vertexMap: vertexMap,
  pathFrom: ["positiveZ"],
  pathTo: ["negativeX"],
  model: turnL_N_model,
} satisfies Tile;

export default tile;
