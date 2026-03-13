import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../../API/CoreAppService';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../core/LoadingService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  constructor(public loadingService: LoadingService, private CoreAppService: CoreAppService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const token = params.get('verifyToken');
      if (token) {
        this.VerifyEmail(token);
      }
    });
  }

  async VerifyEmail(verifyToken: string) {
    this.loadingService.show();
    try {
      await this.CoreAppService.VerifyEmail(verifyToken);
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว',
      });
    } finally {
      this.loadingService.hide();
    }
  }
}