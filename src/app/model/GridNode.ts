import { GridCoordinates } from "./GridCoordinates";
import { NodeStatus } from "./NodeStatus";
export class GridNode {
  coordinates: GridCoordinates;
  nodeStatus: NodeStatus;
  distance: number;
  previousNode: GridNode;
  travelValue: number;

  constructor(coordinates: GridCoordinates, distance: number) {
    this.coordinates = coordinates;
    this.nodeStatus = NodeStatus.EMPTY;
    this.distance = distance;
    this.travelValue = distance;
  }

  isSameAs(node: GridNode) {
    return (
      this.coordinates.x === node.coordinates.x &&
      this.coordinates.y === node.coordinates.y
    );
  }
}
