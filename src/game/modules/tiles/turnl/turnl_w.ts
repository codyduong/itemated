import { Tile } from "game/modules/Tile";
import { turnL_W_model, vertexMap } from "./model";

const tile = {
  name: "TurnL_W",
  vertexMap: vertexMap,
  pathFrom: ["positiveX"],
  pathTo: ["positiveZ"],
  model: turnL_W_model,
} satisfies Tile;

export default tile;
