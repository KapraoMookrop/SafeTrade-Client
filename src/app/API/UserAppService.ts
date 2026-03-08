import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserLoginRequest } from '../types/UserLoginRequest';
import { UserSignUpDataRequest } from '../types/UserSignUpDataRequest';
import { LoginResponseData } from '../types/LoginResponseData';

@Injectable({
    providedIn: 'root'
})
export class UserAppService {

    private baseUrl = 'https://safe-trade-server.vercel.app';
    // private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }
    async Login(request: UserLoginRequest): Promise<LoginResponseData> {

        const observable = this.http.post<LoginResponseData>(
            `${this.baseUrl}/api/users/Login`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Signup(request: UserSignUpDataRequest): Promise<void> {

        const observable = this.http.post<void>(
            `${this.baseUrl}/api/users/SignUp`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }
}
