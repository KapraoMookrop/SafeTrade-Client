import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateDealRequest } from '../../../types/CreateDealRequest';
import { DealStatus } from '../../../types/Enum';

@Component({
    selector: 'app-create-deal-dialog',
    imports: [FormsModule, CommonModule],
    providers: [],
    templateUrl: './create-deal-dialog.html',
})
export class CreateDealDialog extends BaseComponent {
    title: string = '';
    description: string = '';
    amount: number | null = null;

    constructor(
        private dialogRef: MatDialogRef<CreateDealDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { chatRoomId: string; buyerId: string; sellerId: string }
    ) {
        super();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        if (!this.title.trim()) {
            this.SwalError('ข้อผิดพลาด', 'กรุณากรอกหัวข้อดีล/ชื่อสินค้า', '.cdk-global-overlay-wrapper');
            return;
        }
        if (this.amount === null || this.amount <= 0) {
            this.SwalError('ข้อผิดพลาด', 'กรุณากรอกจำนวนเงินให้ถูกต้อง', '.cdk-global-overlay-wrapper');
            return;
        }

        const request: CreateDealRequest = {
            ChatRoomId: this.data.chatRoomId,
            BuyerId: this.data.buyerId,
            SellerId: this.data.sellerId,
            Title: this.title,
            Description: this.description,
            Amount: this.amount,
            Status: DealStatus.WAITING_PAYMENT
        };

        this.dialogRef.close(request);
    }
}