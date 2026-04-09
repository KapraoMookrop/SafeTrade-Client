import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserSignUpDataRequest } from '../types/UserSignUpDataRequest';
import { LoginResponseData } from '../types/LoginResponseData';
import { environment } from '../../environments/environment';
import { UserLoginDataRequest } from '../types/UserLoginDataRequest';
import { ApplySellerRequestData } from '../types/ApplySellerRequestData';

@Injectable({
    providedIn: 'root'
})
export class UserAppService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }
    async Login(request: UserLoginDataRequest): Promise<LoginResponseData> {

        const observable = this.http.post<LoginResponseData>(
            `${this.baseUrl}/users/Login`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Signup(request: UserSignUpDataRequest): Promise<void> {

        const observable = this.http.post<void>(
            `${this.baseUrl}/users/SignUp`, request
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async CheckAlreadyExistsEmail(email: string): Promise<boolean> {

        const observable = this.http.get<{ exists: boolean }>(
            `${this.baseUrl}/users/CheckAlreadyExistsEmail?email=${email}`
        );
        const response = await lastValueFrom(observable);
        return response.exists;
    }
    async ApplySeller(request: ApplySellerRequestData): Promise<void> {
        const formData = new FormData();
        formData.append('BankId', request.BankId);
        formData.append('BankNumber', request.BankNumber);
        if (request.IdCardImage) {
            formData.append('IdCardImage', request.IdCardImage);
        }
        if (request.SelfieImage) {
            formData.append('SelfieImage', request.SelfieImage);
        }

        const observable = this.http.post<void>(
            `${this.baseUrl}/users/ApplySeller`,
            formData
        );

        return await lastValueFrom(observable);
    }
}
