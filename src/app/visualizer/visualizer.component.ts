import { Component, OnInit } from "@angular/core";
import { PathfindingService } from "../pathfinding.service";
import { Grid } from "../model/Grid";
import { GridNode } from "../model/GridNode";
import { GridCoordinates } from "../model/GridCoordinates";
import { GridRow } from "../model/GridRow";
import { NodeStatus } from "../model/NodeStatus";
import { HostListener } from "@angular/core";
@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer.component.html",
  styleUrls: ["./visualizer.component.css"]
})
export class VisualizerComponent {
  // TODO start and endnode can be overridden
  // TODO one click should act normal
  readonly ROWS = 20;
  readonly COLUMNS = 50;
  readonly height = 30;
  readonly width = 30;

  private startNode: GridNode;
  private finishNode: GridNode;
  private draggingStatus: NodeStatus;

  grid: Grid = new Grid();

  constructor(private pathfindingService: PathfindingService) {
    this.initNodes(this.ROWS, this.COLUMNS);
  }

  visualizeAlgorithm() {
    this.pathfindingService.gridSubject.subscribe((grid: Grid) => {
      this.grid = grid;
      console.log("gridUpdate");
    });

    this.pathfindingService.solutionSubject.subscribe((node: GridNode) => {
      this.visualizeSolution(node);
    });
    this.pathfindingService.dijkstra(
      this.grid,
      this.startNode,
      this.finishNode
    );
  }

  visualizeSolution(node: GridNode) {
    let currentNode = node;
    console.log("visualizing");
    console.log(node);
    const loop = setInterval(() => {
      if (!currentNode.previousNode) {
        clearInterval(loop);
      }
      this.grid.findNode(currentNode.coordinates).nodeStatus =
        NodeStatus.SOLUTION;
      currentNode = currentNode.previousNode;
    }, 100);
  }

  mouseDown(node: GridNode, event) {
    event.preventDefault();
    event.stopPropagation();
    const gridNode = this.grid.findNode(node.coordinates);
    if (gridNode.nodeStatus === NodeStatus.EMPTY) {
      gridNode.nodeStatus = NodeStatus.WALL;
    } else if (gridNode.nodeStatus === NodeStatus.WALL) {
      gridNode.nodeStatus = NodeStatus.EMPTY;
    }
    this.draggingStatus = gridNode.nodeStatus;
  }
  mouseEnter(node: GridNode, event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.draggingStatus) {
      const gridNode = this.grid.findNode(node.coordinates);
      switch (this.draggingStatus) {
        case NodeStatus.WALL:
          gridNode.nodeStatus = this.handleNodeClick(gridNode);
          break;
        case NodeStatus.EMPTY:
          gridNode.nodeStatus = this.handleNodeClick(gridNode);
          break;
        case NodeStatus.START:
          gridNode.nodeStatus = NodeStatus.START;
          this.startNode = gridNode;
          break;
        case NodeStatus.FINISH:
          gridNode.nodeStatus = NodeStatus.FINISH;
          this.finishNode = gridNode;
          break;
        default:
          break;
      }
    }
  }
  mouseLeave(node: GridNode, event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draggingStatus) {
      const gridNode = this.grid.findNode(node.coordinates);
      switch (this.draggingStatus) {
        case NodeStatus.START:
          gridNode.nodeStatus = NodeStatus.EMPTY;
          break;
        case NodeStatus.FINISH:
          gridNode.nodeStatus = NodeStatus.EMPTY;
          break;
        default:
          break;
      }
    }
  }

  @HostListener("window:mouseup")
  onMouseup() {
    this.draggingStatus = null;
  }

  private initNodes(rows: number, columns: number) {
    for (let x = 0; x < rows; x++) {
      const row: GridNode[] = [];
      for (let y = 0; y < columns; y++) {
        row.push(new GridNode(new GridCoordinates(x, y)));
      }
      this.grid.nodes.push(row);
    }
    this.startNode = this.grid.findNode(new GridCoordinates(10, 10));
    this.finishNode = this.grid.findNode(new GridCoordinates(10, 30));
    this.startNode.nodeStatus = NodeStatus.START;
    this.finishNode.nodeStatus = NodeStatus.FINISH;
  }

  private handleNodeClick(gridNode: GridNode): NodeStatus {
    switch (gridNode.nodeStatus) {
      case NodeStatus.WALL:
        return NodeStatus.EMPTY;
      case NodeStatus.EMPTY:
        return NodeStatus.WALL;
      case NodeStatus.START:
        return NodeStatus.START;
      case NodeStatus.FINISH:
        return NodeStatus.FINISH;
      default:
        return NodeStatus.EMPTY;
    }
  }
}
