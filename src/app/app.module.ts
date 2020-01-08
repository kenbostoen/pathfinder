import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";
import { VisualizerComponent } from "./visualizer/visualizer.component";
import { NavComponent } from './nav/nav.component';
@NgModule({
  declarations: [AppComponent, VisualizerComponent, NavComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
