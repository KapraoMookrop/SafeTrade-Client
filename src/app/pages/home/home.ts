import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl } from '@angular/forms';
import { AppStateService } from '../../core/AppStateService';
import { LoadingService } from '../../core/LoadingService';
import { CoreAppService } from '../../API/CoreAppService';
import { Verify2FAType } from '../../types/Enum';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './home.html',
})
export class Home {
  constructor(public stateService: AppStateService,
    public loadingService: LoadingService,
    private readonly cdr: ChangeDetectorRef,
    private readonly CoreAppService: CoreAppService) {
  }

  qr: string = '';
  async Enable2FA() {
    this.loadingService.show();
    try {
      const result = await this.CoreAppService.Enable2FA();
      this.qr = result.qr;
      Swal.fire({
        icon: 'success',
        title: 'เปิดใช้งาน 2FA สำเร็จ',
        html: ` <p>1. สแกน QR Code ด้วยแอป Authenticator</p>
                <p>2. กด <b>สแกนแล้ว</b> เพื่อกรอกรหัสยืนยัน</p>`,
        imageUrl: this.qr,
        imageWidth: 200,
        imageHeight: 200,
        confirmButtonText: 'สแกนแล้ว'
      }).then(() => {
        this.VerifyEnable2FA();
      });
    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการเปิดใช้งาน 2FA',
      });
    } finally {
      this.loadingService.hide();
    }
  }

  async VerifyEnable2FA() {
    Swal.fire({
      title: 'กรอกรหัสยืนยัน',
      text: 'กรอกรหัส 6 หลักจากแอป Authenticator',
      input: 'text',
      inputPlaceholder: '123456',
      inputAttributes: {
        maxlength: '6',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      confirmButtonText: 'ยืนยัน',
      showCancelButton: true,
      cancelButtonText: 'ยกเลิก',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณากรอกรหัสยืนยัน';
        }
        if (value.length !== 6) {
          return 'รหัสต้องมี 6 หลัก';
        }
        return null;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const code = result.value;
        try {
          await this.CoreAppService.Verify2FA(this.stateService.user()?.Email || '', code, Verify2FAType.VERIFYENABLE);
          Swal.fire({
            icon: 'success',
            title: 'เปิดใช้งาน 2FA เรียบร้อยแล้ว'
          });
        } catch (err: HttpErrorResponse | any) {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.error?.message || 'รหัสยืนยันไม่ถูกต้อง',
          });
        }
      }
    });
  }
}