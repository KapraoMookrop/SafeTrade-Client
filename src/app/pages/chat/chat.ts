import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { AppStateService } from '../../core/AppStateService';
import { BaseComponent } from '../../core/BaseComponent';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './chat.html',
})
export class Chat extends BaseComponent {
  constructor() {
    super();
  }

  ngOnInit() {

  }

  async SearchData() {
    
  }
}