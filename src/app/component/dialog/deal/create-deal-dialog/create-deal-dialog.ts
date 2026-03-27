import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../../core/BaseComponent';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-create-deal-dialog',
    imports: [FormsModule, CommonModule],
    providers: [],
    templateUrl: './create-deal-dialog.html',
})
export class CreateDealDialog extends BaseComponent {
    name: string = '';
    constructor(private dialogRef: MatDialogRef<CreateDealDialog>, 
                @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
    }

    close() {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close({
            name: this.name
        });
    }

}