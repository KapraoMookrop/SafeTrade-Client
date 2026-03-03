import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private baseUrl = 'https://tron-project-backend.vercel.app';
    // private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }
    // async Login(UserData: UserData): Promise<string> {

    //     const observable = this.http.post<string>(
    //         `${this.baseUrl}/api/auth/login`, UserData
    //     );

    //     const response = await lastValueFrom(observable);
    //     return response;
    // }

    // async Signup(UserData: UserData): Promise<void> {

    //     const observable = this.http.post<void>(
    //         `${this.baseUrl}/api/auth/register`, UserData
    //     );

    //     const response = await lastValueFrom(observable);
    //     return response;
    // }
}
