import { Tile } from "game/modules/Tile";
import { toVertexMap } from "game/modules/VertexMap";

const tile = {
  name: "void",
  vertexMap: toVertexMap([]),
  pathFrom: [],
  pathTo: [],
  model: new Instance("Model"),
} satisfies Tile;

export default tile;
