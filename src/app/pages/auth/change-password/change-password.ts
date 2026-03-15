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
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  constructor(public loadingService: LoadingService,
    private CoreAppService: CoreAppService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  token: string = '';
  NewPassword: string = '';
  IsNewShowPassword: boolean = false;
  ConfirmPassword: string = '';
  IsConfirmPassword: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const token = params.get('verifyToken');
      if (token) {
        this.token = token;
      }
    });
  }

  async ChangePassword() {
    if (this.NewPassword != this.ConfirmPassword) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        text: 'กรุณากรอกรหัสผ่านให้ตรงกัน',
        showConfirmButton: false
      });
      return;
    }

    const validationResult = await this.validatePassword(this.NewPassword);
    if (!validationResult.isValid) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        text: validationResult.details,
        showConfirmButton: false
      });
      return;
    }

    try {
      this.loadingService.show();
      await this.CoreAppService.ChangePassword(this.token, this.NewPassword);
      Swal.fire({
        icon: 'success',
        title: 'เปลี่ยนรหัสผ่านสำเร็จ',
        text: 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว',
      }).then(() => {
        this.router.navigate(['/login']);
      });
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      this.loadingService.hide();
    }
  }

  private async validatePassword(password: string): Promise<{ isValid: boolean; details: string; }> {
    if (password.length < 8) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ อย่างน้อย 1 ตัว"
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวพิมพ์เล็ก อย่างน้อย 1 ตัว"
      };
    }

    if (!/\d/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยตัวเลข อย่างน้อย 1 ตัว"
      };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        details: "รหัสผ่านต้องประกอบด้วยอักขระพิเศษ อย่างน้อย 1 ตัว"
      };
    }

    return {
      isValid: true,
      details: ""
    };
  }
}