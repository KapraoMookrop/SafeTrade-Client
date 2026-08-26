import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SendMessagesRequest } from '../types/SendMessagesRequest';
import { MessageRequestData } from '../types/MessageRequestData';
import { MessageDataList } from '../types/MessageDataList';
import { ChatRoomData } from '../types/ChatRoomData';
import { SKIP_LOADING } from '../core/LoadingContext';

@Injectable({
    providedIn: 'root'
})
export class ChatAppService {

    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    async SendMessage(request: SendMessagesRequest): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/chat/SendMessages`,
            request,
            { context: new HttpContext().set(SKIP_LOADING, true) }
        ));
    }

    async GetMessages(request: MessageRequestData): Promise<MessageDataList> {
        return await lastValueFrom(this.http.post<MessageDataList>(
            `${this.baseUrl}/chat/GetMessages`,
            request,
            { context: new HttpContext().set(SKIP_LOADING, true) }
        ));
    }

    async MarkAsRead(request: MessageRequestData): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/chat/MarkAsRead`,
            request,
            { context: new HttpContext().set(SKIP_LOADING, true) }
        ));
    }

    async GetAllChatRooms(): Promise<ChatRoomData[]> {
        return await lastValueFrom(this.http.get<ChatRoomData[]>(
            `${this.baseUrl}/chat/GetAllChatRooms`
        ));
    }
}
