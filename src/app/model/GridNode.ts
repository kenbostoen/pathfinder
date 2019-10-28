import { GridCoordinates } from "./GridCoordinates";
import { NodeStatus } from "./NodeStatus";
export class GridNode {
  coordinates: GridCoordinates;
  nodeStatus: NodeStatus;
  distance: number;
  previousNode: GridNode;
  travelValue: number;

  constructor(coordinates: GridCoordinates) {
    this.coordinates = coordinates;
    this.nodeStatus = NodeStatus.EMPTY;
    this.distance = 999999999;
    this.travelValue = 999999999;
  }

  isSameAs(node: GridNode) {
    return (
      this.coordinates.x === node.coordinates.x &&
      this.coordinates.y === node.coordinates.y
    );
  }
}
