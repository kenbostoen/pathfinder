import { Injectable } from "@angular/core";
import { Grid } from "./model/Grid";
import { GridNode } from "./model/GridNode";
import { NodeStatus } from "./model/NodeStatus";
import { Subject } from "rxjs";
import { timeout } from "q";

@Injectable({
  providedIn: "root"
})
export class PathfindingService {
  gridSubject = new Subject<Grid>();
  solutionSubject = new Subject<GridNode>();

  grid: Grid;

  dijkstra(grid: Grid, startNode: GridNode, finishNode: GridNode) {
    console.log("start dijkstra");
    if (!grid || !startNode || !finishNode || startNode.isSameAs(finishNode)) {
      console.log("oops");
      return false;
    }
    this.grid = grid;
    startNode.distance = 0;
    const nodes: GridNode[] = this.flattenNodes(this.grid.nodes);
    const unvisitedNodes: GridNode[] = nodes.slice();
    console.log(unvisitedNodes);
    const interval = setInterval(() => {
      if (!unvisitedNodes.length) {
        clearInterval(interval);
      }
      this.sortNodesByDistance(unvisitedNodes);
      const closestNode: GridNode = unvisitedNodes.shift();
      closestNode.nodeStatus = NodeStatus.VISITED;
      this.grid.updateNodes([closestNode]);
      if (closestNode.isSameAs(finishNode)) {
        clearInterval(interval);
        this.solutionSubject.next(closestNode);
      }
      this.updateUnvisitedNeighbors(closestNode);
      this.gridSubject.next(this.grid);
    }, 10);
  }
  updateUnvisitedNeighbors(node: GridNode) {
    const neighbors = this.getUnvisitedNeighbors(node, this.grid);
    for (const neighbor of neighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
    }
    this.grid.updateNodes(neighbors);
  }

  sortNodesByDistance(nodes: GridNode[]) {
    nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  flattenNodes(nodes: GridNode[][]): GridNode[] {
    return [].concat(...nodes);
  }

  getUnvisitedNeighbors(node: GridNode, grid: Grid): GridNode[] {
    const neighbors: GridNode[] = [];

    const nodeRow: number = node.coordinates.x;
    const nodeCol: number = node.coordinates.y;

    if (nodeRow > 0 && nodeCol < grid.getColSize()) {
      neighbors.push(grid.findNode({ x: nodeRow - 1, y: nodeCol }));
    }
    if (nodeRow < grid.getRowSize() - 1 && nodeCol >= 0) {
      neighbors.push(grid.findNode({ x: nodeRow + 1, y: nodeCol }));
    }
    if (nodeCol > 0 && nodeRow < grid.getRowSize()) {
      neighbors.push(grid.findNode({ x: nodeRow, y: nodeCol - 1 }));
    }
    if (nodeCol < grid.getColSize() - 1 && nodeRow >= 0) {
      neighbors.push(grid.findNode({ x: nodeRow, y: nodeCol + 1 }));
    }
    return neighbors.filter(
      (neighbor: GridNode) =>
        neighbor.nodeStatus !== NodeStatus.VISITED &&
        neighbor.nodeStatus !== NodeStatus.WALL
    );
  }
}
