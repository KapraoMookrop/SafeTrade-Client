import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../core/BaseComponent';
import { DealSearchCriteria } from '../../../types/DealSearchCriteria';
import { AdminDealAppService } from '../../../API/AdminDealAppService';
import { DealStatus } from '../../../types/Enum';
import { ViewDealDialog } from '../../../component/dialog/view-deal-dialog/view-deal-dialog';
import { DealAdminData } from '../../../types/DealAdminData';

@Component({
  selector: 'app-manage-deals',
  templateUrl: './manage-deals.html',
  imports: [FormsModule, CommonModule]
})
export class ManageDeals extends BaseComponent implements OnInit {

  deals: DealAdminData[] = [];
  totalCount: number = 0;

  criteria: DealSearchCriteria = {
    Page: 1,
    PageSize: 10,
    SortBy: "d.created_at",
    SortDirection: "DESC",
    DealStatus: DealStatus.WAITING_PAYMENT
  };

  get totalPages() {
    return Math.ceil(this.totalCount / this.criteria.PageSize);
  }

  constructor(private AdminDealAppService: AdminDealAppService) {
    super();
  }

  ngOnInit() {
    this.SearchAsync();
  }

  async SearchAsync() {
    try {
      const result = await this.AdminDealAppService.FindAsync(this.criteria);
      this.deals = result.Data;
      this.totalCount = result.TotalCount;
      await this.RefreshDetectChanges();
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

  async OpenDealInfo(dealId: string) {
    try {
      this.ShowLoading();
      const dealData = await this.AdminDealAppService.GetDealByIdAsync(dealId);
      this.HideLoading();

      const dialogRef = this.DialogService.open(ViewDealDialog, {
        data: dealData
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result) {
          await this.SearchAsync();
        }
      });
    } catch (error: HttpErrorResponse | any) {
      this.HideLoading();
      this.SwalError('เกิดข้อผิดพลาด', error.error?.message || error.message);
    }
  }
}
