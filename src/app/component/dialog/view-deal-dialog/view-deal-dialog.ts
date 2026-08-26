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
            'กรุณาตรวจสอบว่ายอดเงินโอนเข้าบัญชี Escrow ถูกต้องและเข้าระบบเรียบร้อยแล้ว',
            'ยืนยัน',
            'ยกเลิก',
            '.cdk-global-overlay-wrapper'
        );

        if (confirm.isConfirmed) {
            try {
                this.ShowLoading();
                await this.AdminDealAppService.ConfirmPayment(this.deal.Id);
                this.HideLoading();
                await this.SwalSuccess('สำเร็จ', 'ยืนยันยอดเงินสำเร็จและอัปเดตสถานะดีลเป็น PAID เรียบร้อยแล้ว', '.cdk-global-overlay-wrapper');
                this.dialogRef.close(true);
            } catch (err: any) {
                this.HideLoading();
                this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message, '.cdk-global-overlay-wrapper');
            }
        }
    }

    async releaseEscrow() {
        const confirm = await this.SwalConfirmAlert(
            'ยืนยันการโอนเงินให้ผู้ขาย?',
            'คุณแน่ใจหรือไม่ว่าต้องการโอนเงินค่าสินค้าออกจากระบบ Escrow ไปยังผู้ขาย? การดำเนินการนี้ไม่สามารถยกเลิกได้',
            'ยืนยัน',
            'ยกเลิก',
            '.cdk-global-overlay-wrapper'
        );

        if (confirm.isConfirmed) {
            try {
                this.ShowLoading();
                await this.AdminDealAppService.ReleaseEscrow(this.deal.Id);
                this.HideLoading();
                await this.SwalSuccess('สำเร็จ', 'โอนเงินเข้าบัญชีผู้ขายเสร็จสมบูรณ์ ดีลปิดเรียบร้อยแล้ว', '.cdk-global-overlay-wrapper');
                this.dialogRef.close(true);
            } catch (err: any) {
                this.HideLoading();
                this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message, '.cdk-global-overlay-wrapper');
            }
        }
    }
}
