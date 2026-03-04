import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppService } from '../../API/AppService';
import Swal from 'sweetalert2';
import { AppStateService } from '../../core/AppStateService';
import { LoadingService } from '../../core/LoadingService';
import { AuthService } from '../../core/AuthService';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [],
  templateUrl: './navber.html',
})
export class Navbar implements OnInit {
  dialogLoginVisible = false;
  dialogSignupVisible = false;
  dialogTranVisible = false;
  token?: string;
  tron_address?: string;
  username?: string;

  constructor(private stateService: AppStateService, private loadingService: LoadingService, private authAppService: AuthService ) { }

  ngOnInit() {
    
  }

}
