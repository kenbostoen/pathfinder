import { Injectable } from "@angular/core";
import { Grid } from "./model/Grid";
import { GridNode } from "./model/GridNode";
import { NodeStatus } from "./model/NodeStatus";
import { Subject } from "rxjs";
import { timeout } from "q";

@Injectable({
  providedIn: "root"
})
export class AstarService {
  gridSubject = new Subject<Grid>();
  solutionSubject = new Subject<GridNode>();

  grid: Grid;

  astar(grid: Grid, startNode: GridNode, finishNode: GridNode) {
    console.log(startNode);
    
    if (!grid || !startNode || !finishNode || startNode.isSameAs(finishNode)) {
      console.log("oops");
      return false;
    }
    this.grid = grid;
    startNode.distance = 0;
    startNode.travelValue = 0;
    const nodes: GridNode[] = this.flattenNodes(this.grid.nodes);
    const unvisitedNodes: GridNode[] = nodes.slice();
    console.log(unvisitedNodes)
    const interval = setInterval(() => {
      if (!unvisitedNodes.length) {
        clearInterval(interval);
      }
      const sortedUnvisitedNodes = this.sortNodesByDistance(unvisitedNodes);
      const closestNode: GridNode = sortedUnvisitedNodes.shift();
      if (closestNode.distance === 999999999) {
        clearInterval(interval);
      }
      closestNode.nodeStatus = NodeStatus.VISITED;
      this.grid.updateNodes([closestNode]);
      if (closestNode.isSameAs(finishNode)) {
        
        clearInterval(interval);
        console.log('doneeeee');
        this.solutionSubject.next(closestNode);
        //this.solutionSubject.complete();
      }
      console.log(closestNode)
      this.updateUnvisitedNeighbors(closestNode, finishNode);
      this.gridSubject.next(this.grid);
    }, 10);
    this.gridSubject.complete();
  }
  updateUnvisitedNeighbors(node: GridNode, finishNode: GridNode) {
    const neighbors = this.getUnvisitedNeighbors(node, this.grid);
    for (const neighbor of neighbors) {
      if (neighbor.nodeStatus === NodeStatus.WEIGHTED) {
        neighbor.travelValue = node.travelValue + 5;
        neighbor.distance =
          node.travelValue +
          5 +
          this.getDistanceFromFinishNode(neighbor, finishNode);
      } else {
        neighbor.travelValue = node.travelValue + 1;
        neighbor.distance =
          node.travelValue +
          1 +
          this.getDistanceFromFinishNode(neighbor, finishNode);
      }
      neighbor.previousNode = node;
    }
    this.grid.updateNodes(neighbors);
  }

  sortNodesByDistance(nodes: GridNode[]): GridNode[] {
    return nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  flattenNodes(nodes: GridNode[][]): GridNode[] {
    return [].concat(...nodes);
  }

  getDistanceFromFinishNode(node: GridNode, finishNode: GridNode): number {
    const xVal = Math.abs(node.coordinates.x - finishNode.coordinates.x);
    const yVal = Math.abs(node.coordinates.y - finishNode.coordinates.y);
    return xVal + yVal;
  }

  getUnvisitedNeighbors(node: GridNode, grid: Grid): GridNode[] {
    const neighbors: GridNode[] = [];
    console.log(node);
    
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
