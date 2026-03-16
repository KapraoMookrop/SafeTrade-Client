import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CoreAppService } from '../../../API/CoreAppService';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../core/BaseComponent';

@Component({
  selector: 'app-delete-account',
  imports: [FormsModule, CommonModule, NgSelectModule],
  providers: [],
  templateUrl: './delete-account.html',
})
export class DeleteAccount extends BaseComponent {
  constructor(private CoreAppService: CoreAppService) {
    super();
  }

  ngOnInit() {
    this.Route.paramMap.subscribe(params => {
      const token = params.get('deleteToken');
      if (token) {
        this.DeleteAccount(token);
      }
    });
  }

  async DeleteAccount(deleteToken: string) {
    try {
      await this.CoreAppService.DeleteAccount(deleteToken);
      await this.SwalAlert('ลบบัญชีสำเร็จ', 'บัญชีของคุณถูกลบแล้ว ขอบคุณที่ใช้บริการของเรา', 'success', 1500, false).then(() => {
        this.NavigateTo('/login');
      });
    } catch (err: HttpErrorResponse | any) {
      await this.SwalError('ลบบัญชีไม่สำเร็จ', err.error?.message || 'เกิดข้อผิดพลาดในการลบบัญชีของคุณ');
    }
  }
}