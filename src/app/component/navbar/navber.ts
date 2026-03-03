import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppService } from '../../API/AppService';
import Swal from 'sweetalert2';
import { App } from '../../app';
import { AppStateService } from '../../core/AppStateService';
import { LoadingService } from '../../core/LoadingService';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [],
  templateUrl: './navber.html',
})
export class Navbar {
  dialogLoginVisible = false;
  dialogSignupVisible = false;
  dialogTranVisible = false;
  token?: string;
  tron_address?: string;
  username?: string;

  constructor(private stateService: AppStateService, private loadindService: LoadingService) { }

  ngOnInit() {
    this.loadindService.show();
  }

  ngDoCheck() {

  }

}
