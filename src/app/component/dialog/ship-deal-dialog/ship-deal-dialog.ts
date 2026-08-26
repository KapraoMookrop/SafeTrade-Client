import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { DealAppService } from '../../../API/DealAppService';

@Component({
    selector: 'app-ship-deal-dialog',
    imports: [FormsModule, CommonModule],
    templateUrl: './ship-deal-dialog.html'
})
export class ShipDealDialog extends BaseComponent {
    dealId: string;
    carrier: string = 'Flash Express';
    trackingNumber: string = '';
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    carriers = [
        'Flash Express',
        'Kerry Express',
        'J&T Express',
        'Thailand Post',
        'DHL Express'
    ];

    constructor(
        private dialogRef: MatDialogRef<ShipDealDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { dealId: string },
        private DealAppService: DealAppService
    ) {
        super();
        this.dealId = data.dealId;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
                this.RefreshDetectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    async submit() {
        if (!this.carrier) {
            await this.Swaltoast('กรุณาเลือกบริษัทขนส่ง', 'error', 2000, false, '.cdk-global-overlay-wrapper');
            return;
        }
        if (!this.trackingNumber.trim()) {
            await this.Swaltoast('กรุณากรอกเลขพัสดุ', 'error', 2000, false, '.cdk-global-overlay-wrapper');
            return;
        }
        if (!this.selectedFile) {
            await this.Swaltoast('กรุณาอัปโหลดรูปถ่ายพัสดุ', 'error', 2000, false, '.cdk-global-overlay-wrapper');
            return;
        }

        try {
            this.ShowLoading();
            
            // เรียกใช้ระบบตรวจสอบเลขพัสดุจำลอง (Dummy tracking API validator)
            const isTrackingValid = await this.validateTrackingNumber(this.carrier, this.trackingNumber);
            if (!isTrackingValid) {
                this.HideLoading();
                await this.SwalError('เลขพัสดุไม่ถูกต้อง', 'ไม่พบข้อมูลของเลขพัสดุนี้ในระบบของขนส่ง', '.cdk-global-overlay-wrapper');
                return;
            }

            await this.DealAppService.ShipDeal(this.dealId, this.carrier, this.trackingNumber, this.selectedFile);
            this.HideLoading();
            await this.SwalSuccess('บันทึกข้อมูลสำเร็จ', 'ข้อมูลการจัดส่งพัสดุถูกบันทึกเข้าระบบเรียบร้อยแล้ว', '.cdk-global-overlay-wrapper');
            this.dialogRef.close(true);
        } catch (err: any) {
            this.HideLoading();
            await this.SwalError('เกิดข้อผิดพลาด', err.error?.message || err.message, '.cdk-global-overlay-wrapper');
        }
    }

    // ฟังก์ชันจำลองการเรียกใช้งาน Tracking API เช็กเลขพัสดุ
    private async validateTrackingNumber(carrier: string, trackingNumber: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // จำลองว่าเช็กผ่านเสมอ (ตามโจทย์)
                // สามารถเขียนลอจิกเช็กความถูกต้องรูปแบบเลขพัสดุของแต่ละขนส่งได้ในอนาคต
                resolve(true);
            }, 1000);
        });
    }

    close() {
        this.dialogRef.close();
    }
}
