import { Component } from "@angular/core";
import { GridNode } from "../model/GridNode";
import { GridCoordinates } from "../model/GridCoordinates";
import { Grid } from "../model/Grid";
import { GridRow } from "../model/GridRow";
import { NodeStatus } from "../model/NodeStatus";
import { HostListener } from "@angular/core";

@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.css"]
})
export class GridComponent {
  private readonly ROWS = 20;
  private readonly COLUMNS = 50;
  private readonly height = 30;
  private readonly width = 30;

  private startNode: GridNode;
  private finishNode: GridNode;
  private draggingStatus: NodeStatus;

  grid: Grid = new Grid();
  constructor() {
    this.initNodes(this.ROWS, this.COLUMNS);
  }

  clickNode(node: GridNode) {
    let gridNode = this.grid.findNode(node.coordinates);
    gridNode.nodeStatus = NodeStatus.WALL;
    this.setSpecialNodes(gridNode);
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
          gridNode.nodeStatus = NodeStatus.WALL;
          break;
        case NodeStatus.START:
          gridNode.nodeStatus = NodeStatus.START;
          break;
        case NodeStatus.FINISH:
          gridNode.nodeStatus = NodeStatus.FINISH;
          break;
        case NodeStatus.EMPTY:
          gridNode.nodeStatus = NodeStatus.EMPTY;
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
      let row: GridRow = new GridRow();
      for (let y = 0; y < columns; y++) {
        row.nodes.push(new GridNode(new GridCoordinates(x, y)));
      }
      this.grid.rows.push(row);
    }

    this.grid.findNode(new GridCoordinates(10, 10)).nodeStatus =
      NodeStatus.START;
    this.grid.findNode(new GridCoordinates(10, 30)).nodeStatus =
      NodeStatus.FINISH;
  }
  private setSpecialNodes(gridNode: GridNode) {
    switch (gridNode.nodeStatus) {
      case NodeStatus.START:
        if (this.startNode) {
          this.grid.findNode(this.startNode.coordinates).nodeStatus =
            NodeStatus.EMPTY;
        }
        this.startNode = gridNode;
        break;
      case NodeStatus.FINISH:
        if (this.finishNode) {
          this.grid.findNode(this.finishNode.coordinates).nodeStatus =
            NodeStatus.EMPTY;
        }
        this.finishNode = gridNode;
        break;
      default:
        break;
    }
  }
}
