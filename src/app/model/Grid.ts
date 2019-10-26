import { GridCoordinates } from "./GridCoordinates";
import { GridNode } from "./GridNode";

export class Grid {
  nodes: GridNode[][] = [];
  constructor() {
    this.nodes = [];
  }

  findNode(coordinates: GridCoordinates): GridNode {
    return this.nodes[coordinates.x][coordinates.y];
  }

  updateNodes(nodes: GridNode[]) {
    for (const node of nodes) {
      const gridNode = this.findNode(node.coordinates);
      gridNode.nodeStatus = node.nodeStatus;
      gridNode.previousNode = node.previousNode;
      gridNode.distance = node.distance;
    }
  }

  getColSize(): number {
    if (this.nodes.length > 0) {
      return this.nodes[0].length;
    }
    return 0;
  }

  getRowSize(): number {
    return this.nodes.length;
  }
}
