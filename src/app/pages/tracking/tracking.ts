import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../core/BaseComponent';

@Component({
  selector: 'app-tracking',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './tracking.html',
})
export class Tracking extends BaseComponent {
  constructor() {
    super();
  }
}