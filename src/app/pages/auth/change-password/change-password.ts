import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../../API/CoreAppService';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './change-password.html',
})
export class ChangePassword extends BaseComponent {
  constructor(private CoreAppService: CoreAppService) {
    super();
  }

  token: string = '';
  NewPassword: string = '';
  IsNewShowPassword: boolean = false;
  ConfirmPassword: string = '';
  IsConfirmPassword: boolean = false;

  ngOnInit() {
    this.Route.paramMap.subscribe(params => {
      const token = params.get('verifyToken');
      if (token) {
        this.token = token;
      }
    });
  }

  async ChangePassword() {
    if (this.NewPassword != this.ConfirmPassword) {
      await this.Swaltoast('รหัสผ่านไม่ตรงกัน', 'error');
      return;
    }

    const validationResult = await this.validatePassword(this.NewPassword);
    if (!validationResult.isValid) {
      await this.Swaltoast(validationResult.details, 'error');
      return;
    }

    try {
      await this.CoreAppService.ChangePassword(this.token, this.NewPassword);
      await this.SwalAlert('เปลี่ยนรหัสผ่านสำเร็จ', 'คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว', 'success').then(() => {
        this.NavigateTo('/login');
      });
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', err.error?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
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