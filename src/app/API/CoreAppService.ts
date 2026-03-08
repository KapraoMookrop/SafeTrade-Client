import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ProvinceData } from '../types/ProvinceData';
import { SubDistrictData } from '../types/SubDistrictData';
import { DistrictData } from '../types/DistrictData';

@Injectable({
    providedIn: 'root'
})
export class CoreAppService {

    private baseUrl = 'https://safe-trade-server.vercel.app';
    // private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }
    async GetProvinces(): Promise<ProvinceData[]> {
        const observable = this.http.get<ProvinceData[]>(
            `${this.baseUrl}/api/core/GetProvinces`
        );

        const response = await lastValueFrom(observable);
        return response;
    }

    async GetDistricts(provinceId: string): Promise<DistrictData[]> {
        const observable = this.http.get<DistrictData[]>(
            `${this.baseUrl}/api/core/GetDistricts?provinceId=${provinceId}`
        );
        const response = await lastValueFrom(observable);
        return response;
    }

    async GetSubDistricts(districtId: string): Promise<SubDistrictData[]> {
        const observable = this.http.get<SubDistrictData[]>(
            `${this.baseUrl}/api/core/GetSubDistricts?districtId=${districtId}`
        );
        const response = await lastValueFrom(observable);
        return response;
    }
}
