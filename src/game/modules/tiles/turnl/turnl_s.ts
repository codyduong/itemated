import { Tile } from "game/modules/Tile";
import { turnL_S_model, vertexMap } from "./model";

const tile = {
  name: "TurnL_S",
  vertexMap: vertexMap,
  pathFrom: ["negativeZ"],
  pathTo: ["positiveX"],
  model: turnL_S_model,
} satisfies Tile;

export default tile;
