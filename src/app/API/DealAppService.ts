import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateChatRoomRequest } from '../types/CreateChatRoomRequest';
import { CreateDealRequest } from '../types/CreateDealRequest';

@Injectable({
    providedIn: 'root'
})
export class DealAppService {

    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    async CreateChatRoom(request: CreateChatRoomRequest): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/deal/CreateChatRoom`,
            request
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async AcceptInvite(chatRoomMemberId: string): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/deal/AcceptInvite`,
            { chatRoomMemberId }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async RejectInvite(chatRoomMemberId: string): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/deal/RejectInvite`,
            { chatRoomMemberId }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async CreateDeal(request: CreateDealRequest): Promise<string> {
        const observable = this.http.post<string>(
            `${this.baseUrl}/deal/CreateDeal`,
            request
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async UploadPaymentSlip(dealId: string, slipFile: File): Promise<{ success: boolean; paymentId: string }> {
        const formData = new FormData();
        formData.append('dealId', dealId);
        formData.append('SlipImage', slipFile);

        const observable = this.http.post<{ success: boolean; paymentId: string }>(
            `${this.baseUrl}/deal/UploadPaymentSlip`,
            formData
        );
        return await lastValueFrom(observable);
    }
}