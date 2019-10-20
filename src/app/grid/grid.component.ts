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
  constructor() {
    this.initNodes(this.ROWS, this.COLUMNS);
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
          break;
        case NodeStatus.FINISH:
          gridNode.nodeStatus = NodeStatus.FINISH;
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
      const row: GridRow = new GridRow();
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

  private handleNodeClick(gridNode: GridNode): NodeStatus {
    switch (gridNode.nodeStatus) {
      case NodeStatus.WALL:
        return NodeStatus.EMPTY;
        break;
      case NodeStatus.EMPTY:
        return NodeStatus.WALL;
        break;
      case NodeStatus.START:
        return NodeStatus.START;
        break;
      case NodeStatus.FINISH:
        return NodeStatus.FINISH;
        break;
      default:
        return NodeStatus.EMPTY;
        break;
    }
  }
}
