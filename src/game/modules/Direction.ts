/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Direction definition
 */

/**
 * the player spawns facing -Z (ive arbitrarily decided this is NORTH)
 * -Z -> North
 * +X -> East
 * +Z -> South
 * -X -> West
 */
export type Direction = "negativeX" | "positiveX" | "negativeZ" | "positiveZ" | "positiveY" | "negativeY";
export const DIRECTIONS: Direction[] = ["negativeX", "positiveX", "negativeZ", "positiveZ", "positiveY", "negativeY"];
export function getOppositeDirection(direction?: Direction): Direction | undefined {
  switch (direction) {
    case "positiveX":
      return "negativeX";
    case "negativeX":
      return "positiveX";
    case "positiveY":
      return "negativeY";
    case "negativeY":
      return "positiveY";
    case "positiveZ":
      return "negativeZ";
    case "negativeZ":
      return "positiveZ";
    case undefined:
      return undefined;
    default:
      error("Invalid direction");
  }
}

export function getVector(direction: Direction): [x: number, y: number, z: number] {
  switch (direction) {
    case "negativeX":
      return [-1, 0, 0];
    case "positiveX":
      return [1, 0, 0];
    case "negativeY":
      return [0, -1, 0];
    case "positiveY":
      return [0, 1, 0];
    case "negativeZ":
      return [0, 0, -1];
    case "positiveZ":
      return [0, 0, 1];
  }
}
