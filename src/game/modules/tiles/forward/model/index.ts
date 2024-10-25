import { rotateNegativeYAxis } from "game/modules/tiles/utils";
import { toVertexMap } from "game/modules/VertexMap";

export const forward_N_model = script.WaitForChild("Forward_N") as Model;

export const forward_E_model = forward_N_model.Clone();
rotateNegativeYAxis(forward_E_model, 90);
forward_E_model.Name = "Forward_E";

export const forward_S_model = forward_N_model.Clone();
rotateNegativeYAxis(forward_S_model, 180);
forward_S_model.Name = "Forward_S";

export const forward_W_model = forward_N_model.Clone();
rotateNegativeYAxis(forward_W_model, 270);
forward_W_model.Name = "Forward_W";

export const vertexMap = toVertexMap([
  /* eslint-disable prettier/prettier */
  "0,1,0;1", "0,1,1;1", "0,1,2;1", "1,1,0;1", "1,1,1;1", "1,1,2;1", "2,1,0;1", "2,1,1;1", "2,1,2;1",
  "0,2,0;0", "0,2,1;0", "0,2,2;0", "1,2,0;0", "1,2,1;0", "1,2,2;0", "2,2,0;0", "2,2,1;0", "2,2,2;0",
  /* eslint-enable prettier/prettier */
]);
