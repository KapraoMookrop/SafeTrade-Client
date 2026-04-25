import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SendMessagesRequest } from '../types/SendMessagesRequest';
import { SKIP_LOADING } from '../core/LoadingContext';
import { MessageRequestData } from '../types/MessageRequestData';
import { MessageDataList } from '../types/MessageDataList';
import { ChatRoomData } from '../types/ChatRoomData';
import { ResponseData } from '../types/ResponseData';
import { SellerData } from '../types/SellerData';
import { SellerSearchCriteria } from '../types/SellerSearchCriteria';

@Injectable({
    providedIn: 'root'
})
export class SellerAppService {

    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    async FindAsync(criteria: SellerSearchCriteria): Promise<ResponseData<SellerData>> {
        const observable = this.http.post<ResponseData<SellerData>>(
            `${this.baseUrl}/admin/Seller/FindAsync`,
            criteria
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}