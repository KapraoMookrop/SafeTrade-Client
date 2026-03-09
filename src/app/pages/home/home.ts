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
    try {
      const result = await Swal.fire({
        title: 'ยืนยันตัวตน',
        html: `<div style="text-align:center">
                        <p style="margin-bottom:10px">กรอกรหัส 6 หลักจากแอป Authenticator</p>
    
                        <div id="otp-container" style="display:flex; gap:10px; justify-content:center;">
                          <input class="otp-input" maxlength="1" />
                          <input class="otp-input" maxlength="1" />
                          <input class="otp-input" maxlength="1" />
                          <input class="otp-input" maxlength="1" />
                          <input class="otp-input" maxlength="1" />
                          <input class="otp-input" maxlength="1" />
                        </div>
                      </div>`,
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
        focusConfirm: false,

        didOpen: () => {
          const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');

          inputs.forEach((input, index) => {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');

            input.addEventListener('input', () => {

              // ให้รับเฉพาะตัวเลข
              input.value = input.value.replaceAll(/[^0-9]/g, '');

              if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
              }
            });

            input.addEventListener('keydown', (e) => {

              // กันปุ่มที่ไม่ใช่ตัวเลข
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== 'Backspace' &&
                e.key !== 'Tab' &&
                e.key !== 'ArrowLeft' &&
                e.key !== 'ArrowRight'
              ) {
                e.preventDefault();
              }

              if (e.key === 'Backspace' && !input.value && index > 0) {
                inputs[index - 1].focus();
              }
            });

          });

          inputs[0].focus();
        },

        preConfirm: () => {
          const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
          let code = '';

          inputs.forEach(i => code += i.value);

          if (code.length !== 6) {
            Swal.showValidationMessage('กรุณากรอกรหัส 6 หลัก');
            return false;
          }

          return code;
        }
      });

      if (!result.isConfirmed) {
        this.loadingService.hide();
        return;
      }

      this.loadingService.show();
      await this.CoreAppService.Verify2FA(this.stateService.user()?.Email || '', result.value, Verify2FAType.VERIFYENABLE);
      this.loadingService.hide();
      Swal.fire({
        icon: 'success',
        title: 'ยืนยัน 2FA สำเร็จ',
        text: 'คุณได้เปิดใช้งาน 2FA แล้ว',
      });

    } catch (err: HttpErrorResponse | any) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.error?.message || 'เกิดข้อผิดพลาดในการยืนยัน 2FA',
      });
      this.loadingService.hide();
    }
  }
}