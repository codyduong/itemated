/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file
 *
 * Waveform Collapse
 *
 * - https://github.com/mxgmn/WaveFunctionCollapse
 * - https://www.youtube.com/watch?v=2SuvO4Gi7uY
 *   - https://bolddunkley.itch.io/wfc-mixed
 *   - https://marian42.de/article/wfc/
 */

import { DIRECTIONS, getVector } from "./Direction";
import { allTiles, allTilesMap, isEnd, isPath, isStart } from "./tiles";

type Grid = Plane[];
type Plane = Superposition[][];
type Superposition = string[];
type Coordinate = { x: number; y: number; z: number };

interface WaveFunctionCollapseProps {
  x: number;
  y: number;
  z: number;
  seed?: number;
  horizontalPadding: number;
  pathLength: number;
}

export class WaveFunctionCollapse {
  private grid: Grid;
  readonly x_size: number;
  readonly y_size: number;
  readonly z_size: number;
  readonly seed: number;
  readonly random: Random;
  readonly horizontalPadding: number;
  readonly verticalPadding = 0; // todo add boundary conditions in the y axis
  private pathLength: number;
  private path: Vector3[] = [];
  // assuming a cube... don't do tiles that aren't cubes... -@codyduong
  private readonly tileSize = 8;

  constructor(props: WaveFunctionCollapseProps) {
    this.x_size = props.x;
    this.y_size = props.y;
    this.z_size = props.z;
    // can range from -9_007_199_254_740_991 and 9_007_199_254_740_991,
    // but we are constrained to int32 due to math.random being called in C
    this.seed = props.seed ?? math.random(-2_147_483_647, 2_147_483_647);
    this.random = new Random(this.seed);
    this.grid = this.setupGrid();
    this.horizontalPadding = props.horizontalPadding;
    this.pathLength = props.pathLength;
    // print(this.grid);
  }

  /**
   * Checks if a coordinate is valid
   */
  private isValidCoordinate({ x, y, z }: Coordinate): boolean {
    if (x >= this.x_size || x < 0) {
      return false;
    }
    if (y >= this.y_size || y < 0) {
      return false;
    }
    if (z >= this.z_size || z < 0) {
      return false;
    }

    return true;
  }

  /**
   * TODO @codyduong, audit usage or deprecate
   */
  private getCoordinatesByTaxicabDistance(
    origin: Coordinate,
    n: number,
    predicate: (superposition: Superposition, coordinate?: Coordinate) => boolean,
  ): Coordinate[] {
    const results: Coordinate[] = [];
    const { x, y, z } = origin;

    // Generate all possible combinations for dx, dy, dz such that |dx| + |dy| + |dz| == n
    for (let dx = -n; dx <= n; dx++) {
      for (let dy = -n; dy <= n; dy++) {
        const dz = n - math.abs(dx) - math.abs(dy);
        if (dz >= -n && dz <= n) {
          const possibleCoords: Coordinate[] = [
            { x: x + dx, y: y + dy, z: z + dz },
            { x: x + dx, y: y + dy, z: z - dz },
          ];

          for (const coord of possibleCoords) {
            if (this.isValidCoordinate(coord) && predicate(this.grid[coord.x][coord.y][coord.z], coord)) {
              results.push(coord);
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Initializes a grid of superpositions with padding to account for path not going over edges. If any other special
   * rules are constrained ahead of collapse, then this is where you would put it.
   */
  private setupGrid(): Grid {
    let result = [];
    for (let x = 0; x < this.x_size; x++) {
      let ai = [];
      for (let y = 0; y < this.y_size; y++) {
        let aj = [];
        for (let z = 0; z < this.z_size; z++) {
          // Don't allow path positions that go off the edge
          let reducedTiles = allTiles.filter((tile) => {
            const startEdge = this.horizontalPadding;
            const endEdgeX = this.x_size - this.horizontalPadding - 1;
            const endEdgeZ = this.z_size - this.horizontalPadding - 1;

            if (
              (x === startEdge && (tile.pathTo.includes("negativeX") || tile.pathFrom.includes("negativeX"))) ||
              (x === endEdgeX && (tile.pathTo.includes("positiveX") || tile.pathFrom.includes("positiveX")))
            ) {
              return false;
            }
            if (
              (y === 0 && (tile.pathTo.includes("negativeY") || tile.pathFrom.includes("negativeY"))) ||
              (y === this.y_size - 1 && (tile.pathTo.includes("positiveY") || tile.pathFrom.includes("positiveY")))
            ) {
              return false;
            }
            if (
              (z === startEdge && (tile.pathTo.includes("negativeZ") || tile.pathFrom.includes("negativeZ"))) ||
              (z === endEdgeZ && (tile.pathTo.includes("positiveZ") || tile.pathFrom.includes("positiveZ")))
            ) {
              return false;
            }
            // Don't allow path positions that are within the edge
            if (isPath(tile.name) && (x < startEdge || x > endEdgeX || z < startEdge || z > endEdgeZ)) {
              return false;
            }

            return true;
          });

          aj.push(reducedTiles.map(({ name }) => name));
        }
        ai.push(aj);
      }
      result.push(ai);
    }

    return result;
  }

  /**
   * Propogate the changes to a coordinate with either a collapsed position or a subset of the original superposition
   */
  private propogate(to: Coordinate, superposition: Superposition): Grid {
    const stack: { to: Coordinate; superposition: Superposition }[] = [];
    const visited: Set<string> = new Set();

    // Helper function to create a unique string key for each coordinate
    const coordinateKey = (coord: Coordinate) => `${coord.x},${coord.y},${coord.z}`;

    // Push the initial coordinate onto the stack
    stack.push({ to, superposition });

    while (stack.size() > 0) {
      const { to: currentCoord, superposition: currentSuperposition } = stack.pop()!;

      const old_superposition = this.grid[currentCoord.x][currentCoord.y][currentCoord.z];
      const key = coordinateKey(currentCoord);

      // If already visited, skip
      if (visited.has(key)) {
        continue;
      }

      // If no changes would happen, skip
      if (
        old_superposition.size() === currentSuperposition.size() &&
        old_superposition.filter((s) => !currentSuperposition.includes(s)).size() === 0
      ) {
        continue;
      }

      if (old_superposition.size() < currentSuperposition.size()) {
        error("Waveform collapse uncollapsed? What happened!!!");
      }

      // Update the grid
      // task.synchronize();
      this.grid[currentCoord.x][currentCoord.y][currentCoord.z] = currentSuperposition;
      // task.desynchronize();

      // Mark this coordinate as visited
      visited.add(key);

      // Iterate through all directions and push neighboring coordinates onto the stack
      DIRECTIONS.forEach((direction) => {
        const vector = getVector(direction);
        const toVisit: Coordinate = {
          x: currentCoord.x + vector[0],
          y: currentCoord.y + vector[1],
          z: currentCoord.z + vector[2],
        };

        // Skip if the coordinate is invalid
        if (!this.isValidCoordinate(toVisit)) {
          return;
        }

        const visitKey = coordinateKey(toVisit);
        if (!visited.has(visitKey)) {
          // Get neighboring superpositions
          let n_superposition: Superposition = this.grid[toVisit.x][toVisit.y][toVisit.z];

          // Get acceptable adjacent superpositions
          const superadjacents: Superposition = [];
          currentSuperposition.forEach((name) =>
            allTilesMap[name].adjacency[direction].forEach((p) => {
              if (!superadjacents.includes(p)) {
                superadjacents.push(p);
              }
            }),
          );

          // Filter the neighboring superposition to match our adjacents
          n_superposition = n_superposition.filter((n) => superadjacents.includes(n));

          if (n_superposition.size() === 0) {
            // print(
            //   "state",
            //   this.grid,
            //   "from",
            //   currentCoord,
            //   "to",
            //   toVisit,
            //   "sup",
            //   currentSuperposition,
            //   "adj",
            //   superadjacents,
            // );
            error(`contradiction in: ${direction}, ${this.seed}, ${this.x_size}, ${this.y_size}, ${this.z_size}`);
          }

          stack.push({ to: toVisit, superposition: n_superposition });
        }
      });
    }

    return this.grid;
  }

  /**
   * Retrieves the coordinates of the superposition with the lowest amount of possible positions that isn't collapsed.
   * In case of a tie chooses randomly between tied tiles.
   */
  private lowestEntropy(): Coordinate | undefined {
    let minCount = 2_147_483_647; // just some arbitrarily large value
    let coordinates: Coordinate[] = [];

    this.grid.forEach((plane, x) => {
      plane.forEach((superpositions, y) => {
        superpositions.forEach((superposition, z) => {
          const count = superposition.size();
          if (count === 1) {
            // already collapsed
            return;
          }

          if (count < minCount) {
            minCount = count;
            coordinates = [{ x, y, z }];
          } else if (count === minCount) {
            coordinates.push({ x, y, z });
          }
        });
      });
    });

    return coordinates[this.random.NextInteger(0, coordinates.size() - 1)];
  }

  /**
   * TODO implement. This is demo code. - @codyduong
   */
  private lowestEntropyParallel(): Coordinate {
    let coordinates: Coordinate[] = [];
    const workers: Actor[] = [];

    const xSubSize = math.floor(this.x_size / math.max(math.log(this.x_size, 2), 1));
    const zSubSize = math.floor(this.z_size / math.max(math.log(this.z_size, 2), 1));

    const sharedTableName = "WaveFunctionCollapse";
    const sharedTable = new SharedTable();
    sharedTable["minCount"] = 2_147_483_647; // Arbitrarily large initial value
    sharedTable["grid"] = new SharedTable(this.grid);
    sharedTable["lowestEntropyWorkersComplete"] = 0;
    sharedTable["lowestEntropyCoordinates"] = new SharedTable([]);
    game.GetService("SharedTableRegistry").SetSharedTable(sharedTableName, sharedTable);

    // Split the grid into cubes for parallel processing
    // print(xSubSize, zSubSize);
    const scriptClone = script.Clone();
    for (let startX = 0; startX < this.x_size; startX += xSubSize) {
      // for (let startY = 0; startY < this.y_size; startY += cubeSize) {
      for (let startZ = 0; startZ < this.z_size; startZ += zSubSize) {
        const endX = math.min(startX + xSubSize, this.x_size);
        const endZ = math.min(startZ + zSubSize, this.z_size);

        // print("created", startX, startZ);
        const actor = new Instance("Actor");
        const clone = scriptClone.Clone() as ModuleScript;
        clone.Parent = actor;
        actor.Parent = script;
        workers.push(actor);
        require(clone);
        actor.SendMessage("calculateLowestEntropyChunk", sharedTableName, startX, endX, 0, this.y_size, startZ, endZ);
      }
      // }
    }

    while (sharedTable["lowestEntropyWorkersComplete"] !== workers.size()) {
      // print(sharedTable["lowestEntropyWorkersComplete"]);
      wait();
    }

    // cleanup workers when we are done with them
    workers.forEach((worker) => {
      worker.Destroy();
    });

    const lowestEntropyCoords = sharedTable["lowestEntropyCoordinates"] as unknown as Coordinate[];

    return lowestEntropyCoords[this.random.NextInteger(0, coordinates.size() - 1)];
  }

  /**
   * Randomly choose a valid start position and propogate the changes.
   *
   * This used to also setup the end position but this often led to wfc being unable to solve. So it has been deprecated
   * in favor of a path heuristic
   */
  private setupStartAndEnd() {
    const startPositions: Coordinate[] = [];
    // choose a random starting tile and a ending tile n distance away
    this.grid.forEach((plane, x) =>
      plane.forEach((row, y) =>
        row.forEach((s, z) => {
          if (s.find(isStart) !== undefined) {
            startPositions.push({ x, y, z });
          }
        }),
      ),
    );
    let startPosition = startPositions[this.random.NextInteger(0, startPositions.size() - 1)];
    // startPosition = { x: 0, y: 0, z: 0 };
    assert(startPosition !== undefined, "Failed to create start position?");
    const startSuperposition = this.grid[startPosition.x][startPosition.y][startPosition.z].filter(isStart);
    const selectedStart = startSuperposition[this.random.NextInteger(0, startSuperposition.size() - 1)];
    assert(selectedStart !== undefined, "Failed to select a start tile");
    // parallel lua we have to wait for this result serially, and store it to ensure it is propogates correctly.
    let _ = this.propogate(startPosition, [selectedStart]);
    // print(startPosition, selectedStart, this.grid);
    // task.desynchronize();
    // const endPositions = this.getCoordinatesByTaxicabDistance(
    //   startPosition,
    //   4,
    //   (superposition) => superposition.find(isEnd) !== undefined,
    // );
    // const endPosition = endPositions[this.random.NextInteger(0, endPositions.size() - 1)];
    // assert(endPosition !== undefined, "Failed to create end position?");
    // const endSuperposition = this.grid[endPosition.x][endPosition.y][endPosition.z].filter(isEnd);
    // const selectedEnd = endSuperposition[this.random.NextInteger(0, endSuperposition.size() - 1)];
    // assert(selectedEnd !== undefined, "Failed to select a end tile");
    // this.propogate(endPosition, [selectedEnd]);
    // clear out any tiles that are start or ends
    for (let x = 0; x < this.x_size; x++) {
      for (let y = 0; y < this.y_size; y++) {
        for (let z = 0; z < this.z_size; z++) {
          let temp = table.clone(this.grid[x][y][z]);
          if (temp.size() > 1) {
            // only clear out non collapsed isStart/isEnd
            this.grid[x][y][z] = temp.filter(
              (t) =>
                !(
                  isStart(t)
                  // || isEnd(t)
                ),
            );
          }
        }
      }
    }
  }

  private getPathsToCheck(): Coordinate[] {
    const paths: Coordinate[] = [];
    this.grid.forEach((plane, x) =>
      plane.forEach((row, y) => {
        row.forEach((s, z) => {
          // ie. all collapsed paths
          if (s.size() === 1 && s.find((t) => isPath(t)) !== undefined) {
            paths.push({ x, y, z });
          }
        });
      }),
    );

    const positionsToCollapse: Coordinate[] = [];

    // if a path has a collapsed end, then remove it
    paths.forEach(({ x, y, z }) => {
      const superposition = this.grid[x][y][z];
      assert(superposition.size() === 1, "We failed to consider collapsed superpositions");
      const tile = superposition[0];
      const checkDirection = [...allTilesMap[tile].pathTo, ...allTilesMap[tile].pathFrom].map((direction) =>
        getVector(direction),
      );
      const neighbors = checkDirection.map(([dx, dy, dz]) => ({ x: x + dx, y: y + dy, z: z + dz }));
      neighbors.forEach((n) => {
        const superposition = this.grid[n.x][n.y][n.z];
        if (superposition.size() > 1) {
          positionsToCollapse.push(n);
        }
      });
    });

    return positionsToCollapse;
  }

  /**
   * Chooses a random start path and then runs the wfc collapse on nearest path rather than by lowest entropy
   */
  private collapsePath(): void {
    let positionsToCollapse = this.getPathsToCheck();

    let actualPathLength = 0;
    while (positionsToCollapse.size() > 0) {
      const collapsing = positionsToCollapse.remove(this.random.NextInteger(0, positionsToCollapse.size() - 1));
      assert(collapsing !== undefined, "how did this happen?");
      let superposition = this.grid[collapsing.x][collapsing.y][collapsing.z];

      if (actualPathLength <= this.pathLength) {
        superposition = superposition.filter((s) => !isEnd(s));
      } else {
        superposition = superposition.filter((s) => isEnd(s));
      }

      // we shouldn't actually collapse fully. apply a "light" wave function collapse,
      // reducing only to path, to gurantee a working path. -TODO @codyduong
      // print(superposition);
      const chose = superposition[this.random.NextInteger(0, superposition.size() - 1)];
      // print(chose);
      assert(chose !== undefined, "uh oh");
      let _ = this.propogate(collapsing, [chose]);
      this.path.push(new Vector3());
      actualPathLength += 1;
      const toPathMaybe = [...allTilesMap[chose].pathFrom, ...allTilesMap[chose].pathTo];
      toPathMaybe.forEach((toMaybe) => {
        const [dx, dy, dz] = getVector(toMaybe);
        const dc = { x: collapsing.x + dx, y: collapsing.y + dy, z: collapsing.z + dz };
        // only append paths we still need to collapse
        if (this.grid[dc.x][dc.y][dc.z].size() > 1) {
          positionsToCollapse.push(dc);
        }
      });
      if (positionsToCollapse.size() === 0) {
        // there are scnearios where we have inadvertenly collapsed a tile early, which prevents path from completing
        positionsToCollapse = this.getPathsToCheck();
      }
    }

    if (actualPathLength <= this.pathLength) {
      error("Didn't meet path length, likely hit dead end");
    }

    // then we can fully collapse our path after propogating and checking all adjacencies

    // after we after finished collapsing all paths then remove paths from spawning anywhere else
    for (let x = 0; x < this.x_size; x++) {
      for (let y = 0; y < this.y_size; y++) {
        for (let z = 0; z < this.z_size; z++) {
          let temp = table.clone(this.grid[x][y][z]);
          if (temp.size() > 1) {
            // only clear out non collapsed isStart/isEnd
            this.grid[x][y][z] = temp.filter((t) => !isPath(t));
          }
        }
      }
    }
  }

  /**
   * Collapse the waveform to a state if possible, chooses by lowest entropy.
   * @throws Errors if contradiction found
   */
  collapse(): Grid {
    // print(this.seed);
    let _ = this.setupStartAndEnd();
    let __ = this.collapsePath();
    // print(this.grid);
    while (true) {
      const c = this.lowestEntropy();
      // TODO need to switch to parallel computations
      // const c2 = this.lowestEntropyParallel();

      // print("chose coord", c);
      if (!c) {
        // print("broken");
        break;
      }
      const superposition = this.grid[c.x][c.y][c.z];
      // choose a random one
      const chose = superposition[this.random.NextInteger(0, superposition.size() - 1)];
      if (chose === undefined) {
        // print("broken2");
        break;
      }
      // print("chose", chose);
      this.propogate(c, [chose]);
    }
    // print(this.grid);
    return this.grid;
  }

  show() {
    let start = os.clock();
    let folder = game.Workspace.FindFirstChild("wfc");
    if (folder) {
      folder.Destroy();
    }
    folder = new Instance("Folder");
    folder.Parent = game.Workspace;
    folder.Name = "wfc";
    for (let x = 0; x < this.x_size; x++) {
      for (let y = 0; y < this.y_size; y++) {
        for (let z = 0; z < this.z_size; z++) {
          if (this.grid[x][y][z].size() === 1) {
            let position = this.grid[x][y][z][0];
            let tile = allTilesMap[position];
            let model = tile.model.Clone();
            // 8 is tile size;
            const newPos = new Vector3(10 + x * 8, y * 8, 10 + z * 8);
            const newCFrame = new CFrame(newPos).mul(model.GetPivot().Rotation);
            model.PivotTo(newCFrame);
            model.Parent = folder;
            if (os.difftime(os.clock(), start) > 5) {
              start = os.clock();
              wait();
              task.defer(() => {});
            }
          }
        }
      }
    }
  }
}

/**
 * PARALLEL CODE execution here...
 * TODO: @codyduong, not used yet... just a demo
 */
const actor = script.GetActor();
if (actor !== undefined) {
  actor.BindToMessageParallel(
    "calculateLowestEntropyChunk",
    (
      sharedTableName: string,
      startX: number,
      endX: number,
      startY: number,
      endY: number,
      startZ: number,
      endZ: number,
    ) => {
      // print("received");
      task.synchronize();
      let sharedTable = game.GetService("SharedTableRegistry").GetSharedTable(sharedTableName);
      assert(sharedTable !== undefined, "Failed to find sharedTable");
      let grid = sharedTable["grid"] as unknown as Grid;
      assert(grid !== undefined, "Failed to `grid` on sharedTable");
      task.desynchronize();

      let localMinCount = 2_147_483_647;
      let localCoordinates: Coordinate[] = [];

      for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
          for (let z = startZ; z < endZ; z++) {
            // this macro here in roblox-ts is resolved as #array, due to type annotations
            // | const count = grid[x][y][z].size();
            // explcitly use SharedTable.size
            const count = SharedTable.size(grid[x][y][z] as unknown as SharedTable);
            if (count === 1) {
              // Already collapsed
              continue;
            }

            if (count < localMinCount) {
              localMinCount = count;
              localCoordinates = [{ x, y, z }];
            } else if (count === localMinCount) {
              localCoordinates.push({ x, y, z });
            }
          }
        }
      }

      // Synchronize to sharedTable
      task.synchronize();
      sharedTable = game.GetService("SharedTableRegistry").GetSharedTable(sharedTableName);
      if (localMinCount < (sharedTable["minCount"] as number)) {
        sharedTable["minCount"] = localMinCount;
        sharedTable["lowestEntropyCoordinates"] = localCoordinates as unknown as SharedTable;
      } else if (localMinCount === sharedTable["minCount"]) {
        try {
          SharedTable.update(sharedTable, "lowestEntropyCoordinates", (v) => {
            const existingCoords = v as unknown as SharedTable;

            const push = (s: SharedTable, v2: SharedTableValue) => {
              SharedTable.update(s, SharedTable.size(s), (v) => {
                if (v !== undefined) {
                  // I have no clue what causes this
                  error(`failed!!!, TODO @codyduong`);
                  push(s, v);
                }
                return v2;
              });
            };

            localCoordinates.forEach((coord) => {
              push(existingCoords, new SharedTable(coord));
            });
            return existingCoords as unknown as SharedTableValue;
          });
        } catch (e) {
          print(e, "wompus");
        }
      }
      SharedTable.increment(sharedTable, "lowestEntropyWorkersComplete", 1);
      game.GetService("SharedTableRegistry").SetSharedTable(sharedTableName, sharedTable);
    },
  );
}
