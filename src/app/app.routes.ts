import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Chat } from './pages/chat/chat';
import { Profile } from './pages/profile/profile';
import { Tracking } from './pages/tracking/tracking';
import { Login } from './pages/auth/login/login';
import { VerifyEmail } from './pages/auth/verify-email/verify-email';
import { ChangePassword } from './pages/auth/change-password/change-password';
import { DeleteAccount } from './pages/auth/delete-account/delete-account';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'chat', component: Chat },
    { path: 'tracking', component: Tracking },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'verify-email/:verifyToken', component: VerifyEmail },
    { path: 'change-password/:verifyToken', component: ChangePassword },
    { path: 'delete-account/:deleteToken', component: DeleteAccount }
];
