import { rotateNegativeYAxis } from "game/modules/tiles/utils";
import { toVertexMap } from "game/modules/VertexMap";

export const end_N_model = script.WaitForChild("End_N") as Model;

export const end_E_model = end_N_model.Clone();
rotateNegativeYAxis(end_E_model, 90);
end_E_model.Name = "End_E";

export const end_S_model = end_N_model.Clone();
rotateNegativeYAxis(end_S_model, 180);
end_S_model.Name = "End_S";

export const end_W_model = end_N_model.Clone();
rotateNegativeYAxis(end_W_model, 270);
end_W_model.Name = "End_W";

export const vertexMap = toVertexMap([
  /* eslint-disable prettier/prettier */
  "0,1,0;1", "0,1,1;1", "0,1,2;1", "1,1,0;1", "1,1,1;1", "1,1,2;1", "2,1,0;1", "2,1,1;1", "2,1,2;1",
  "0,2,0;0", "0,2,1;0", "0,2,2;0", "1,2,0;0", "1,2,1;0", "1,2,2;0", "2,2,0;0", "2,2,1;0", "2,2,2;0",
  /* eslint-enable prettier/prettier */
]);
