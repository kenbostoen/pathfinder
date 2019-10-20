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

  grid: Grid = new Grid();
  constructor() {
    this.initNodes(this.ROWS, this.COLUMNS);
  }

  clickNode(node: GridNode) {
    let gridNode = this.grid.findNode(node.coordinates);
    gridNode.nodeStatus = NodeStatus.WALL;
    this.setSpecialNodes(gridNode);
  }

  @HostListener("mousedown", ["$event"])
  onMouseDown(event) {
    // we make sure only draggables on the document elements are selected
    console.log(event);
    // ##### add this code.
    event.preventDefault(); // choose one
    // ##### or add this code.
    return false; // choose one
  }

  private initNodes(rows: number, columns: number) {
    for (let x = 0; x < rows; x++) {
      let row: GridRow = new GridRow();
      for (let y = 0; y < columns; y++) {
        row.nodes.push(new GridNode(new GridCoordinates(x, y)));
      }
      this.grid.rows.push(row);
    }
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
