import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { VisualizerComponent } from "./visualizer/visualizer.component";

const routes: Routes = [{ path: "", component: VisualizerComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
