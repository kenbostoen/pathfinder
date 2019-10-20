import { GridRow } from './GridRow';
import { GridCoordinates } from './GridCoordinates';
import { GridNode } from './GridNode';

export class Grid {
    rows: GridRow[] = [];
    constructor() {
        this.rows = [];
    }

    findNode(coordinates: GridCoordinates): GridNode {
        let nodeToReturn = null;
        this.rows.forEach(row => {
            row.nodes.forEach(node => {
                if (node.coordinates === coordinates) {
                    nodeToReturn = node;
                }
            });
        });
        return nodeToReturn;
    }
}