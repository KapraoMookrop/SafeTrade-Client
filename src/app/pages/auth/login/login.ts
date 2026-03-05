import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAppService } from '../../../API/UserAppService';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { AppStateService } from '../../../core/AppStateService';
import { LoadingService } from '../../../core/LoadingService';
import { UserLoginRequest } from '../../../types/UserLoginRequest';
import { UserSignUpRequest } from '../../../types/UserSignUpRequest';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login {
  Email?: string;
  Password?: string;
  FullName?: string;

  constructor(public loadingService: LoadingService, private UserAppService: UserAppService) {
  }

  ngOnInit() {

  }

  isLogin = true;
  toggle() {
    this.isLogin = !this.isLogin;
  }

  private async login() {
    this.loadingService.show();
    try {

      const request: UserLoginRequest = {
        Email: this.Email || '',
        Password: this.Password || ''
      }

      const result = await this.UserAppService.Login(request);

      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: 'ยินดีต้อนรับเข้าสู่ระบบ',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        this.setLocalStrorage('token', result);
        window.location.href = '/dashboard';
      });

    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      });

      console.error('Login failed:', err);
    } finally {
      this.loadingService.hide();
    }
  }


  private async signup() {
    this.loadingService.show();
    try {
      const request: UserSignUpRequest = {
        FullName: this.FullName || '',
        Email: this.Email || '',
        Password: this.Password || ''
      };

      await this.UserAppService.Signup(request);

      Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ',
        text: 'สามารถเข้าสู่ระบบได้ทันที',
      });

      this.isLogin = true;

    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'สมัครสมาชิกไม่สำเร็จ',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
      });

      console.error('Signup failed:', err);
    } finally {
      this.loadingService.hide();
    }
  }

  setLocalStrorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}