import { GridCoordinates } from './GridCoordinates';
import { NodeStatus } from './NodeStatus';
export class GridNode {
    coordinates: GridCoordinates;
    nodeStatus: NodeStatus;

    constructor(coordinates: GridCoordinates) {
        this.coordinates = coordinates;
        this.nodeStatus = NodeStatus.EMPTY;
    }
}