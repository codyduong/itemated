/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Tile definition
 */

import { Direction } from "./Direction";
import { VertexMap } from "./VertexMap";

export interface Tile {
  name: string;
  vertexMap: VertexMap;
  pathFrom: Direction[];
  pathTo: Direction[];
  model: Model;
  // typically adjacency is decided automatically, but manual overrides can be described
  adjacency_manual?: {
    negativeX: string[];
    positiveX: string[];
    negativeZ: string[];
    positiveZ: string[];
    positiveY: string[];
    negativeY: string[];
  };
  /** defaults to 1 */
  weight?: 0;
}

export type TileAdj = {
  name: string;
  adjacency: {
    negativeX: string[];
    positiveX: string[];
    negativeZ: string[];
    positiveZ: string[];
    positiveY: string[];
    negativeY: string[];
  };
  pathFrom: Direction[];
  pathTo: Direction[];
  model: Model;
  /** defaults to 1 */
  weight?: number;
};
