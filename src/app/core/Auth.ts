import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/JwtPayload';
import { AuthService } from './AuthService';
import { UserClientData } from '../types/UserClientData';

const checkAndLoadUser = (): JwtPayload | null => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const token = localStorage.getItem('token');

    if (!token) return null;

    try {
        const decodeJwt = jwtDecode<JwtPayload>(token);

        const userClient: UserClientData = {
            Email: decodeJwt.email,
            FullName: decodeJwt.fullName,
            Role: decodeJwt.role,
            Phone: decodeJwt.phone,
            KycStatus: decodeJwt.kycStatus,
            UserStatus: decodeJwt.userStatus,
            IsEnabled2FA: decodeJwt.isEnabled2FA
        } as UserClientData;

        authService.SetUserClient(token, userClient, decodeJwt.userId);
        return decodeJwt;
    } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        return null;
    }
};


export const AuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const decoded = checkAndLoadUser();

    if (!decoded) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

export const AdminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const decoded = checkAndLoadUser();

    if (!decoded) {
        router.navigate(['/login']);
        return false;
    }

    if (decoded.role !== "ADMIN") {
        router.navigate(['/home']);
        return false;
    }

    return true;
};