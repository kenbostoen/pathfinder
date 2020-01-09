import { Component, OnInit } from "@angular/core";
import { DijkstraService } from "../dijkstra.service";
import { Grid } from "../model/Grid";
import { GridNode } from "../model/GridNode";
import { GridCoordinates } from "../model/GridCoordinates";
import { VisualizeStatus } from "../model/VisualizeStatus";
import { NodeStatus } from "../model/NodeStatus";
import { HostListener } from "@angular/core";
import { AstarService } from "../astar.service";
import { cloneDeep } from "lodash";
@Component({
  selector: "app-visualizer",
  templateUrl: "./visualizer.component.html",
  styleUrls: ["./visualizer.component.css"]
})
export class VisualizerComponent {
  readonly ROWS = 20;
  readonly COLUMNS = 50;
  readonly height = 30;
  readonly width = 30;

  private startNode: GridNode;
  private finishNode: GridNode;
  private draggingStatus: NodeStatus;
  private subscriptions = [];

  selectedNodeType = "WALL";
  selectedAlgorithm = "DIJKSTRA";
  grid: Grid = new Grid();
  gridSetupPreVisualising: Grid;
  visualizeStatus = VisualizeStatus.READY;

  constructor(
    private dijkstraService: DijkstraService,
    private astarService: AstarService
  ) {
    this.initNodes(this.ROWS, this.COLUMNS);
  }

  resetGrid() {
    this.grid = this.gridSetupPreVisualising;
    this.startNode = this.grid.findNode(new GridCoordinates(this.startNode.coordinates.x, this.startNode.coordinates.y));
    this.finishNode = this.grid.findNode(new GridCoordinates(this.finishNode.coordinates.x, this.finishNode.coordinates.y));
    this.startNode.nodeStatus = NodeStatus.START;
    this.finishNode.nodeStatus = NodeStatus.FINISH;
    this.visualizeStatus = VisualizeStatus.READY;
  }

  cleanGrid() {
    this.grid = new Grid();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
    this.initNodes(this.ROWS, this.COLUMNS);
    this.visualizeStatus = VisualizeStatus.READY;
  }
  visualizeAlgorithm() {
    this.visualizeStatus = VisualizeStatus.RUNNING;
    this.gridSetupPreVisualising = cloneDeep(this.grid);
    if (this.selectedAlgorithm === "DIJKSTRA") {
      this.visualizeDijkstra();
    }
    if (this.selectedAlgorithm === "ASTAR") {
      this.visualizeAstar();
    }
  }

  visualizeDijkstra() {
    this.subscriptions.push(
      this.dijkstraService.gridSubject.subscribe((grid: Grid) => {
        this.grid = grid;
      })
    );

    this.subscriptions.push(
      this.dijkstraService.solutionSubject.subscribe((node: GridNode) => {

        this.visualizeSolution(node);
      })
    );
    this.dijkstraService.dijkstra(this.grid, this.startNode, this.finishNode);
  }
  visualizeAstar() {
    this.subscriptions.push(
      this.astarService.gridSubject.subscribe((grid: Grid) => {
        this.grid = grid;
      })
    );

    this.subscriptions.push(
      this.astarService.solutionSubject.subscribe((node: GridNode) => {
        this.visualizeSolution(node);
      })
    );
    this.astarService.astar(this.grid, this.startNode, this.finishNode);
  }

  visualizeSolution(node: GridNode) {
    let currentNode = node;
    console.log(node);
    
    const loop = setInterval(() => {      
      if (!currentNode.previousNode) {
        this.visualizeStatus = VisualizeStatus.NOT_RUNNING;
        clearInterval(loop);
      }
      const checkedNode = this.grid.findNode(currentNode.coordinates); 
        checkedNode.nodeStatus =
        NodeStatus.SOLUTION;
      currentNode = currentNode.previousNode;
    }, 100);
  }
  

  mouseDown(node: GridNode, event) {
    event.preventDefault();
    event.stopPropagation();
    if(this.visualizeStatus === VisualizeStatus.READY) {
      const gridNode = this.grid.findNode(node.coordinates);
      gridNode.nodeStatus = this.handleNodeClick(gridNode);
      this.draggingStatus = gridNode.nodeStatus;
    }
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
        case NodeStatus.WEIGHTED:
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
        row.push(new GridNode(new GridCoordinates(x, y), this.grid.MAX_DISTANCE));
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
        if (this.selectedNodeType === "WALL") {
          return NodeStatus.EMPTY;
        } else {
          return NodeStatus.WEIGHTED;
        }
      case NodeStatus.WEIGHTED:
        if (this.selectedNodeType === "WEIGHTED") {
          return NodeStatus.EMPTY;
        } else {
          return NodeStatus.WALL;
        }
      case NodeStatus.EMPTY:
        return NodeStatus[this.selectedNodeType];
      case NodeStatus.START:
        return NodeStatus.START;
      case NodeStatus.FINISH:
        return NodeStatus.FINISH;
      default:
        return NodeStatus.EMPTY;
    }
  }
}
