import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VisualizeStatus } from '../model/VisualizeStatus';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  @Input() selectedNodeType: string;
  @Input() selectedAlgorithm: string;
  @Input() visualizeStatus: VisualizeStatus;
  
  @Output() selectedNodeTypeEmitter = new EventEmitter();
  @Output() selectedAlgorithmEmitter = new EventEmitter();
  @Output() resetEmitter = new EventEmitter();
  @Output() startEmitter = new EventEmitter();
  @Output() cleanEmitter = new EventEmitter();

  selectNodeType(type: string){
    this.selectedNodeTypeEmitter.emit(type)
  }

  selectAlgorithm(algorithm: string){
    this.selectedAlgorithmEmitter.emit(algorithm)
  }

  reset() {
    this.resetEmitter.emit();
  }
  clean() {
    this.cleanEmitter.emit();
  }
  start() {
    this.startEmitter.emit();
  }
}
