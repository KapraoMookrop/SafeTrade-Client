import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { AdminDealAppService } from '../../../API/AdminDealAppService';
import { DealAdminData } from '../../../types/DealAdminData';
import { DealStatus } from '../../../types/Enum';

@Component({
    selector: 'app-view-deal-dialog',
    imports: [CommonModule],
    templateUrl: './view-deal-dialog.html'
})
export class ViewDealDialog extends BaseComponent {
    DealStatus = DealStatus;

    constructor(
        private dialogRef: MatDialogRef<ViewDealDialog>,
        @Inject(MAT_DIALOG_DATA) public deal: DealAdminData,
        private AdminDealAppService: AdminDealAppService
    ) {
        super();
    }

    close() {
        this.dialogRef.close();
    }

    async confirmPayment() {
        const confirm = await this.SwalConfirmAlert(
            'ยืนยันยอดเงิน?',
            'กรุณาตรวจสอบว่ายอดเงินโอนเข้าบัญชี Escrow ถูกต้องและเข้าระบบเรียบร้อยแล้ว'
        );

        if (confirm.isConfirmed) {
            try {
                this.ShowLoading();
                await this.AdminDealAppService.ConfirmPayment(this.deal.Id);
                this.HideLoading();
                await this.SwalSuccess('สำเร็จ', 'ยืนยันยอดเงินสำเร็จและอัปเดตสถานะดีลเป็น PAID เรียบร้อยแล้ว');
                this.dialogRef.close(true);
            } catch (err: any) {
                this.HideLoading();
                this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message);
            }
        }
    }
}
