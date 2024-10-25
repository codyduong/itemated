import { rotateNegativeYAxis } from "game/modules/tiles/utils";
import { toVertexMap } from "game/modules/VertexMap";

export const start_N_model = script.WaitForChild("Start_N") as Model;

export const start_E_model = start_N_model.Clone();
rotateNegativeYAxis(start_E_model, 90);
start_E_model.Name = "Start_E";

export const start_S_model = start_N_model.Clone();
rotateNegativeYAxis(start_S_model, 180);
start_S_model.Name = "Start_S";

export const start_W_model = start_N_model.Clone();
rotateNegativeYAxis(start_W_model, 270);
start_W_model.Name = "Start_W";

export const vertexMap = toVertexMap([
  /* eslint-disable prettier/prettier */
  "0,1,0;1", "0,1,1;1", "0,1,2;1", "1,1,0;1", "1,1,1;1", "1,1,2;1", "2,1,0;1", "2,1,1;1", "2,1,2;1",
  "0,2,0;0", "0,2,1;0", "0,2,2;0", "1,2,0;0", "1,2,1;0", "1,2,2;0", "2,2,0;0", "2,2,1;0", "2,2,2;0",
  /* eslint-enable prettier/prettier */
]);
