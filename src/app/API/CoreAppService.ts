import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ProvinceData } from '../types/ProvinceData';
import { SubDistrictData } from '../types/SubDistrictData';
import { DistrictData } from '../types/DistrictData';
import { Verify2FAType } from '../types/Enum';
import { LoginResponseData } from '../types/LoginResponseData';
import { environment } from '../../environments/environment';
import { DropDownData } from '../types/DropDownData';
import { NotificationData } from '../types/NotificationData';
import { SKIP_LOADING } from '../core/LoadingContext';

@Injectable({
    providedIn: 'root'
})
export class CoreAppService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }

    async GetProvinces(): Promise<ProvinceData[]> {
        return await lastValueFrom(this.http.get<ProvinceData[]>(
            `${this.baseUrl}/core/GetProvinces`
        ));
    }

    async GetDistricts(provinceId: string): Promise<DistrictData[]> {
        return await lastValueFrom(this.http.get<DistrictData[]>(
            `${this.baseUrl}/core/GetDistricts?provinceId=${provinceId}`
        ));
    }

    async GetSubDistricts(districtId: string): Promise<SubDistrictData[]> {
        return await lastValueFrom(this.http.get<SubDistrictData[]>(
            `${this.baseUrl}/core/GetSubDistricts?districtId=${districtId}`
        ));
    }


    async VerifyEmail(verifyToken: string): Promise<void> {
        return await lastValueFrom(this.http.get<void>(
            `${this.baseUrl}/core/VerifyEmail?verifyToken=${verifyToken}`
        ));
    }

    async Enable2FA(): Promise<{ qr: string; secret: string; }> {
        return await lastValueFrom(this.http.post<{ qr: string; secret: string; }>(
            `${this.baseUrl}/core/Enable2FA`,
            {}
        ));
    }

    async Disable2FA(): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/Disable2FA`,
            {}
        ));
    }

    async Verify2FA(email: string, token: string, type: Verify2FAType): Promise<LoginResponseData> {
        return await lastValueFrom(this.http.post<LoginResponseData>(
            `${this.baseUrl}/core/Verify2FA`,
            { email, token, type }
        ));
    }

    
    async SendForgotPasswordEmail(email: string): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/SendForgotPasswordEmail`, { email }
        ));
    }

    async ChangePassword(token: string, newPassword: string): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/ChangePassword`, { token, newPassword }
        ));
    }

    async SendMailDeleteAccount(email: string): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/SendMailDeleteAccount`, { email }
        ));
    }

    async DeleteAccount(token: string): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/DeleteAccount`, { token }
        ));
    }

    async FindUsers(textSearch: string): Promise<DropDownData[]> {
        return await lastValueFrom(this.http.post<DropDownData[]>(
            `${this.baseUrl}/core/FindUsers`, 
            { textSearch }
        ));
    }

    async FindBanks(textSearch: string): Promise<DropDownData[]> {
        return await lastValueFrom(this.http.post<DropDownData[]>(
            `${this.baseUrl}/core/FindBanks`, 
            { textSearch }
        ));
    }

    async GetNotifications(): Promise<NotificationData[]> {
        return await lastValueFrom(this.http.get<NotificationData[]>(
            `${this.baseUrl}/core/GetNotifications`,
            { context: new HttpContext().set(SKIP_LOADING, true) }
        ));
    }

    async MarkAllNotificationsAsRead(): Promise<void> {
        return await lastValueFrom(this.http.post<void>(
            `${this.baseUrl}/core/MarkAllNotificationsAsRead`,
            {}
        ));
    }
}
