import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-manage-sellers',
  templateUrl: './manage-sellers.html',
  imports: [FormsModule, CommonModule]
})
export class ManageSellers extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    
  }
}