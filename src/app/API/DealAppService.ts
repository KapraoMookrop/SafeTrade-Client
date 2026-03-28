import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SendMessagesRequest } from '../types/SendMessagesRequest';
import { SKIP_LOADING } from '../core/LoadingContext';
import { MessageRequestData } from '../types/MessageRequestData';
import { MessageDataList } from '../types/MessageDataList';
import { ChatRoomData } from '../types/ChatRoomData';
import { CreateChatRoomRequest } from '../types/CreateChatRoomRequest';

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
}