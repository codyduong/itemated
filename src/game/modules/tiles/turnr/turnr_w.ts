import { Tile } from "game/modules/Tile";
import { turnR_W_model, vertexMap } from "./model";

const tile = {
  name: "TurnR_W",
  vertexMap: vertexMap,
  pathFrom: ["positiveX"],
  pathTo: ["negativeZ"],
  model: turnR_W_model,
} satisfies Tile;

export default tile;
