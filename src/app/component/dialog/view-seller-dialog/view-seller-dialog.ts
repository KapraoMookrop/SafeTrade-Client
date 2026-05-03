import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownData } from '../../../types/DropDownData';
import { ApplySellerRequestData } from '../../../types/ApplySellerRequestData';
import { SellerAppService } from '../../../API/SellerAppService';
import { SellerData } from '../../../types/SellerData';
import { NgxMaskPipe } from 'ngx-mask';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-view-seller-dialog',
    imports: [FormsModule, CommonModule, NgSelectModule, NgxMaskPipe],
    templateUrl: './view-seller-dialog.html',
})
export class ViewSellerDialog extends BaseComponent {
    SellerData: SellerData = {} as SellerData;

    constructor(private dialogRef: MatDialogRef<ViewSellerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: SellerData,
        private SellerAppService: SellerAppService) {
        super();
        this.SellerData = data;
    }

    close() {
        this.dialogRef.close();
    }

    async Approve() {
        const targetElement = document.querySelector('.mat-mdc-dialog-container') as HTMLElement;
        try {
            await this.SellerAppService.ApproveSeller(this.SellerData.UserId);
            this.SwalSuccess("สำเร็จ", "ยืนยันผู้ขายเรียบร้อยแล้ว");
            this.dialogRef.close(true);
        } catch (error: HttpErrorResponse | any) {
            this.SwalError("เกิดข้อผิดพลาด", error.message || "ไม่สามารถยืนยันผู้ขายได้ในขณะนี้", targetElement);
        }
    }

    async Reject() {
        const targetElement = document.querySelector('.mat-mdc-dialog-container') as HTMLElement;
        const { value: comment } = await this.SwalInputAlert(
            "ปฏิเสธผู้ขาย",
            "text",
            "จำเป็นต้องระบุเหตุผล",
            "เหตุผลการปฏิเสธผู้ขาย",
            "กรุณาระบุเหตุผลการปฏิเสธผู้ขาย",
            "ยืนยัน",
            "ยกเลิก",
            targetElement
        );
        try {
            await this.SellerAppService.RejectSeller(this.SellerData.UserId, comment);
            this.SwalSuccess("สำเร็จ", "ปฏิเสธผู้ขายเรียบร้อยแล้ว");
            this.dialogRef.close(true);
        } catch (error: HttpErrorResponse | any) {
            this.SwalError("เกิดข้อผิดพลาด", error.message || "ไม่สามารถปฏิเสธผู้ขายได้ในขณะนี้", targetElement);
        }
    }
}