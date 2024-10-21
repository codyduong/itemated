import { Tile } from "game/modules/Tile";
import { toVertexMap } from "game/modules/VertexMap";

const tile = {
  name: "Forward_N",
  vertexMap: toVertexMap([
    /* eslint-disable prettier/prettier */
"0,0,0", "0,0,1", "0,0,2", "1,0,0", "1,0,1", "1,0,2", "2,0,0", "2,0,1", "2,0,2",
"0,1,0", "0,1,1", "0,1,2", "1,1,0", "1,1,1", "1,1,2", "2,1,0", "2,1,1", "2,1,2",
  /* eslint-enable prettier/prettier */
  ]),
  pathFrom: ["positiveZ"],
  pathTo: ["negativeZ"],
  model: script.WaitForChild("Model"),
} satisfies Tile;

export default tile;
