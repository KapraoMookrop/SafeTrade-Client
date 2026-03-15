import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ProvinceData } from '../types/ProvinceData';
import { SubDistrictData } from '../types/SubDistrictData';
import { DistrictData } from '../types/DistrictData';
import { Verify2FAType } from '../types/Enum';
import { LoginResponseData } from '../types/LoginResponseData';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CoreAppService {

    private readonly baseUrl = environment.apiUrl;

    constructor(private readonly http: HttpClient) { }
    async GetProvinces(): Promise<ProvinceData[]> {
        const observable = this.http.get<ProvinceData[]>(
            `${this.baseUrl}/core/GetProvinces`
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async GetDistricts(provinceId: string): Promise<DistrictData[]> {
        const observable = this.http.get<DistrictData[]>(
            `${this.baseUrl}/core/GetDistricts?provinceId=${provinceId}`
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async GetSubDistricts(districtId: string): Promise<SubDistrictData[]> {
        const observable = this.http.get<SubDistrictData[]>(
            `${this.baseUrl}/core/GetSubDistricts?districtId=${districtId}`
        );
        const response = await lastValueFrom(observable);
        return response;
    }


    async VerifyEmail(verifyToken: string): Promise<void> {

        const observable = this.http.get<void>(
            `${this.baseUrl}/core/VerifyEmail?verifyToken=${verifyToken}`
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async Enable2FA(): Promise<{ qr: string; secret: string; }> {
        const observable = this.http.post<{ qr: string; secret: string; }>(
            `${this.baseUrl}/core/Enable2FA`,
            {}
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async Disable2FA(): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/core/Disable2FA`,
            {}
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async Verify2FA(email: string, token: string, type: Verify2FAType): Promise<LoginResponseData> {
        const observable = this.http.post<LoginResponseData>(
            `${this.baseUrl}/core/Verify2FA`,
            { email, token, type }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    
    async SendForgotPasswordEmail(email: string): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/core/SendForgotPasswordEmail`, { email }
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async ChangePassword(token: string, newPassword: string): Promise<void> {
        const observable = this.http.post<void>(
            `${this.baseUrl}/core/ChangePassword`, { token, newPassword }
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}
