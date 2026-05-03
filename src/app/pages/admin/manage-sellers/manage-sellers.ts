import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { SellerSearchCriteria } from '../../../types/SellerSearchCriteria';
import { SellerAppService } from '../../../API/SellerAppService';
import { SellerVerificationStatus } from '../../../types/Enum';
import { ViewSellerDialog } from '../../../component/dialog/view-seller-dialog/view-seller-dialog';
import { SellerData } from '../../../types/SellerData';

@Component({
  selector: 'app-manage-sellers',
  templateUrl: './manage-sellers.html',
  imports: [FormsModule, CommonModule]
})
export class ManageSellers extends BaseComponent implements OnInit {

  sellers: SellerData[] = [];
  totalCount: number = 0;

  criteria: SellerSearchCriteria = {
    Page: 1,
    PageSize: 10,
    SortBy: "u.full_name",
    SortDirection: "ASC",
    SellerStatus: SellerVerificationStatus.PENDING
  };

  get totalPages() {
    return Math.ceil(this.totalCount / this.criteria.PageSize);
  }

  constructor(private SellerAppService: SellerAppService) {
    super();
  }

  ngOnInit() {
    this.SearchAsync();
  }

  async SearchAsync() {
    try {
      const result = await this.SellerAppService.FindAsync(this.criteria);
      this.sellers = result.Data || result.Data;
      this.totalCount = result.TotalCount || result.TotalCount;
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message);
    }
  }

  OnSearch() {
    this.criteria.Page = 1;
    this.SearchAsync();
  }

  OnPageChange(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.criteria.Page = page;
    this.SearchAsync();
  }

  async OpenSellerInfo(sellerId: string) {
    try {
      const sellerData = await this.SellerAppService.GetSellerByIdAsync(sellerId);
      const dialogRef = this.DialogService.open(ViewSellerDialog, {
        data: sellerData
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.SearchAsync();
        }
      });
    } catch (error: HttpErrorResponse | any) {
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message);
    }
  }
}