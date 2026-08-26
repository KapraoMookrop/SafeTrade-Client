import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { DealSearchCriteria } from '../types/DealSearchCriteria';
import { ResponseData } from '../types/ResponseData';
import { DealAdminData } from '../types/DealAdminData';

@Injectable({
    providedIn: 'root'
})
export class AdminDealAppService {

    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    async FindAsync(criteria: DealSearchCriteria): Promise<ResponseData<DealAdminData>> {
        const observable = this.http.post<ResponseData<DealAdminData>>(
            `${this.baseUrl}/admin/Deals/FindAsync`,
            criteria
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async GetDealByIdAsync(dealId: string): Promise<DealAdminData> {
        const observable = this.http.get<DealAdminData>(
            `${this.baseUrl}/admin/Deals/GetDealByIdAsync`,
            { params: { id: dealId } }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async ConfirmPayment(dealId: string): Promise<{ message: string }> {
        const observable = this.http.post<{ message: string }>(
            `${this.baseUrl}/admin/Deals/ConfirmPayment`,
            { dealId }
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}
