import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownData } from '../../../types/DropDownData';
import { CoreAppService } from '../../../API/CoreAppService';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-apply-seller-dialog',
    imports: [FormsModule, CommonModule, NgSelectModule, NgxMaskDirective],
    templateUrl: './apply-seller-dialog.html',
})
export class ApplySellerDialog extends BaseComponent {
    BankId: string = '';
    Banks: DropDownData[] = [];
    step: number = 1;
    idCardPreview: string | ArrayBuffer | null = null;
    selfiePreview: string | ArrayBuffer | null = null;

    constructor(private dialogRef: MatDialogRef<ApplySellerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private CoreAppService: CoreAppService) {
        super();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close({
            bankId: this.BankId
        });
    }

    async FindBanks(event: { term: string; items: any[] }) {
        const term = event.term?.toLowerCase();

        if (!term || term.length < 2) return;

        const local = this.Banks.filter(bank => bank.DisplayText.toLowerCase().includes(term));

        if (local.length > 0) {
            this.Banks = local;
            return;
        }

        try {
            const result = await this.CoreAppService.FindBanks(term);
            this.Banks = result;
        } catch (error) {
            this.SwalError("เกิดข้อผิดพลาด", "ไม่สามารถค้นหาธนาคารได้ในขณะนี้");
        }

        this.RefreshDetectChanges();
    }

    onFileSelected(event: any, type: 'idCard' | 'selfie') {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (type === 'idCard') {
                    this.idCardPreview = reader.result;
                } else {
                    this.selfiePreview = reader.result;
                }
                this.RefreshDetectChanges();
            };
            reader.readAsDataURL(file);

        }
    }

    nextStep() {
        if (this.step == 1 && (!this.idCardPreview || !this.selfiePreview)) {
            return;
        }

        this.step++;
    }

    prevStep(){
        this.step--;
    }
}