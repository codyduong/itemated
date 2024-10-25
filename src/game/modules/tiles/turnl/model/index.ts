import { rotateNegativeYAxis } from "game/modules/tiles/utils";
import { toVertexMap } from "game/modules/VertexMap";

export const turnL_N_model = script.WaitForChild("TurnL_N") as Model;

export const turnL_E_model = turnL_N_model.Clone();
rotateNegativeYAxis(turnL_E_model, 90);
turnL_E_model.Name = "TurnL_E";

export const turnL_S_model = turnL_N_model.Clone();
rotateNegativeYAxis(turnL_S_model, 180);
turnL_S_model.Name = "TurnL_S";

export const turnL_W_model = turnL_N_model.Clone();
rotateNegativeYAxis(turnL_W_model, 270);
turnL_W_model.Name = "TurnL_W";

export const vertexMap = toVertexMap([
  /* eslint-disable prettier/prettier */
  "0,1,0;1", "0,1,1;1", "0,1,2;1", "1,1,0;1", "1,1,1;1", "1,1,2;1", "2,1,0;1", "2,1,1;1", "2,1,2;1",
  "0,2,0;0", "0,2,1;0", "0,2,2;0", "1,2,0;0", "1,2,1;0", "1,2,2;0", "2,2,0;0", "2,2,1;0", "2,2,2;0",
  /* eslint-enable prettier/prettier */
]);
