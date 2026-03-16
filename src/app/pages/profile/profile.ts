import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../API/CoreAppService';
import { Verify2FAType } from '../../types/Enum';
import { BaseComponent } from '../../core/BaseComponent';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  providers: [],
  templateUrl: './profile.html',
})
export class Profile extends BaseComponent {
  constructor(private CoreAppService: CoreAppService) {
    super();
  }

  ngOnInit() {

  }

  getLogoUser() {
    return this.AppStateService.user()?.FullName.replaceAll("นาย", "").replaceAll("นางสาว", "").replaceAll("นาง", "").charAt(0) || "";
  }

  qr: string = '';
  async Enable2FA() {
    try {
      const result = await this.CoreAppService.Enable2FA();
      await this.SwalAlertWithImg('เปิดใช้งาน 2FA สำเร็จ',
        `<p>1. สแกน QR Code ด้วยแอป Authenticator</p> <p>2. กด <b>สแกนแล้ว</b> เพื่อกรอกรหัสยืนยัน</p>`,
        result.qr, 200, 200, true, false, 'สแกนแล้ว', 'ยกเลิก').then(async () => {
          await this.VerifyEnable2FA();
        });
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', err.error?.message || 'เกิดข้อผิดพลาดในการเปิดใช้งาน 2FA');
    }
  }

  async VerifyEnable2FA() {
    try {
      const result = await this.Swal2FAAlert();

      if (!result.isConfirmed) {
        return;
      }

      await this.CoreAppService.Verify2FA(this.AppStateService.user()?.Email || '', result.value, Verify2FAType.VERIFYENABLE);
      this.SwalSuccess('ยืนยัน 2FA สำเร็จ', 'คุณได้เปิดใช้งาน 2FA แล้ว');
      this.AuthService.UpdateUser({ IsEnabled2FA: true });

    } catch (err: HttpErrorResponse | any) {
      this.AuthService.UpdateUser({ IsEnabled2FA: this.AppStateService.user()?.IsEnabled2FA });
    }
  }

  async Disable2FA() {
    try {
      const confirm = await this.SwalConfirmAlert('ยืนยันการปิดใช้งาน 2FA', 'คุณแน่ใจหรือไม่ว่าต้องการปิดใช้งาน 2FA?', 'ใช่, ปิดใช้งาน', 'ไม่, ยกเลิก');

      if (confirm.isConfirmed) {
        const result = await this.Swal2FAAlert();

        if (!result.isConfirmed) {
          return;
        }

        await this.CoreAppService.Verify2FA(this.AppStateService.user()?.Email || '', result.value, Verify2FAType.VERIFYENABLE);
        await this.CoreAppService.Disable2FA();
        await this.SwalSuccess('ยืนยัน 2FA สำเร็จ', 'คุณได้ปิดใช้งาน 2FA แล้ว');
        this.AuthService.UpdateUser({ IsEnabled2FA: false });
      }
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('เกิดข้อผิดพลาด', err.error?.message || 'เกิดข้อผิดพลาดในการปิดใช้งาน 2FA');
      this.AuthService.UpdateUser({ IsEnabled2FA: this.AppStateService.user()?.IsEnabled2FA });
    }
  }

  async Toggle2FA(event: Event) {
    event.preventDefault();

    if (this.AppStateService.user()?.IsEnabled2FA) {
      await this.Disable2FA();
    } else {
      await this.Enable2FA();
    }
  }

  async LogOut() {
    const result = await this.SwalConfirmAlert('ออกจากระบบ', 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?', 'ออกจากระบบ', 'ยกเลิก');
    if (result.isConfirmed) {
      this.AuthService.ClearUserClient();
      window.location.href = '/';
    }
  }
}