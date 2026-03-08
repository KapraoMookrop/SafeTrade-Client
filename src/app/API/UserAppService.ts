import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { UserLoginRequest } from '../types/UserLoginRequest';
import { UserSignUpDataRequest } from '../types/UserSignUpDataRequest';
import { ProvinceData } from '../types/ProvinceData';
import { SubDistrictData } from '../types/SubDistrictData';
import { DistrictData } from '../types/DistrictData';

@Injectable({
    providedIn: 'root'
})
export class UserAppService {

    private baseUrl = 'https://safe-trade-server.vercel.app';
    // private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }
    async Login(request: UserLoginRequest): Promise<string> {

        const observable = this.http.post<string>(
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
