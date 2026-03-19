import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SendMessagesRequest } from '../types/SendMessagesRequest';
import { SKIP_LOADING } from '../core/LoadingContext';
import { MessageRequestData } from '../types/MessageRequestData';
import { MessageDataList } from '../types/MessageDataList';

@Injectable({
    providedIn: 'root'
})
export class ChatAppService {

    private readonly baseUrl = environment.apiUrl;
    constructor(private readonly http: HttpClient) { }

    async SendMessage(request: SendMessagesRequest): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/chat/SendMessages`,
            request,
            {
                context: new HttpContext().set(SKIP_LOADING, true)
            }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async GetMessages(request: MessageRequestData): Promise<MessageDataList> {
        const observable = this.http.post<MessageDataList>(
            `${this.baseUrl}/chat/GetMessages`,
            request,
            {
                context: new HttpContext().set(SKIP_LOADING, true)
            }
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}
