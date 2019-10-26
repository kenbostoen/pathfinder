import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { GridComponent } from './grid/grid.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    VisualizerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
