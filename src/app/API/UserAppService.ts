import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UserLoginRequest } from '../types/UserLoginRequest';
import { UserSignUpRequest } from '../types/UserSignUpRequest';

@Injectable({
    providedIn: 'root'
})
export class UserAppService {

    // private baseUrl = 'https://tron-project-backend.vercel.app';
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }
    async Login(request: UserLoginRequest): Promise<string> {

        const observable = this.http.post<string>(
            `${this.baseUrl}/api/users/login`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Signup(request: UserSignUpRequest): Promise<void> {

        const observable = this.http.post<void>(
            `${this.baseUrl}/api/users/register`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }
}
