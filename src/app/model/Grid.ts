import { GridRow } from "./GridRow";
import { GridCoordinates } from "./GridCoordinates";
import { GridNode } from "./GridNode";

export class Grid {
  rows: GridRow[] = [];
  constructor() {
    this.rows = [];
  }

  findNode(coordinates: GridCoordinates): GridNode {
    return this.rows[coordinates.x].nodes[coordinates.y];
  }
}
