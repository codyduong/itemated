/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Utility functions for managing tile initialization
 */

/**
 * This is equivalent to rotating clockwise when looking along the negativeY axis
 */
export function rotateNegativeYAxis(model: Model, degrees: 90 | 180 | 270): Model {
  model.PivotTo(model.GetPivot().mul(CFrame.Angles(0, -math.rad(degrees), 0)));
  return model;
}
