import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropDownData } from '../../../types/DropDownData';
import { CoreAppService } from '../../../API/CoreAppService';

@Component({
    selector: 'app-create-chat-dialog',
    imports: [FormsModule, CommonModule, NgSelectModule],
    providers: [],
    templateUrl: './create-chat-dialog.html',
})
export class CreateChatDialog extends BaseComponent {
    UserId: string = '';
    Users: DropDownData[] = [];
    constructor(private dialogRef: MatDialogRef<CreateChatDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private CoreAppService: CoreAppService) {
        super();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close({
            userId: this.UserId
        });
    }

    async FindUsers(event: { term: string; items: any[] }) {
        const term = event.term?.toLowerCase();

        if (!term || term.length < 2) return;

        const local = this.Users.filter(user => user.DisplayText.toLowerCase().includes(term));

        if (local.length > 0) {
            this.Users = local;
            return;
        }

        try {
            const result = await this.CoreAppService.FindUsers(term);
            this.Users = result;
        } catch (error) {
            this.SwalError("เกิดข้อผิดพลาด", "ไม่สามารถค้นหาผู้ใช้ได้ในขณะนี้", ".cdk-global-overlay-wrapper");
        }

        this.RefreshDetectChanges();
    }
}