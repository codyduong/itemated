import { rotateNegativeYAxis } from "game/modules/tiles/utils";
import { toVertexMap } from "game/modules/VertexMap";

export const turnR_N_model = script.WaitForChild("TurnR_N") as Model;

export const turnR_E_model = turnR_N_model.Clone();
rotateNegativeYAxis(turnR_E_model, 90);
turnR_E_model.Name = "TurnR_E";

export const turnR_S_model = turnR_N_model.Clone();
rotateNegativeYAxis(turnR_S_model, 180);
turnR_S_model.Name = "TurnR_S";

export const turnR_W_model = turnR_N_model.Clone();
rotateNegativeYAxis(turnR_W_model, 270);
turnR_W_model.Name = "TurnR_W";

export const vertexMap = toVertexMap([
  /* eslint-disable prettier/prettier */
  "0,1,0;1", "0,1,1;1", "0,1,2;1", "1,1,0;1", "1,1,1;1", "1,1,2;1", "2,1,0;1", "2,1,1;1", "2,1,2;1",
  "0,2,0;0", "0,2,1;0", "0,2,2;0", "1,2,0;0", "1,2,1;0", "1,2,2;0", "2,2,0;0", "2,2,1;0", "2,2,2;0",
  /* eslint-enable prettier/prettier */
]);
