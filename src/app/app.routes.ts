import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Chat } from './pages/chat/chat';
import { Profile } from './pages/profile/profile';
import { Tracking } from './pages/tracking/tracking';
import { Login } from './pages/auth/login/login';
import { VerifyEmail } from './pages/auth/verify-email/verify-email';
import { ChangePassword } from './pages/auth/change-password/change-password';
import { DeleteAccount } from './pages/auth/delete-account/delete-account';
import { ChatRoom } from './pages/chat-room/chat-room';
import { ManageSellers } from './pages/admin/manage-sellers/manage-sellers';
import { ManageDeals } from './pages/admin/manage-deals/manage-deals';
import { AdminGuard, AuthGuard } from './core/Auth';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        title: 'SafeTrade - Home',
        path: 'home',
        component: Home,
        canActivate: [AuthGuard]
    },
    {
        title: 'SafeTrade - Chat',
        path: 'chat',
        component: Chat,
        canActivate: [AuthGuard]
    },
    {
        title: 'SafeTrade - Tracking',
        path: 'tracking',
        component: Tracking,
        canActivate: [AuthGuard]
    },
    {
        title: 'SafeTrade - Profile',
        path: 'profile',
        component: Profile,
        canActivate: [AuthGuard]
    },
    {
        title: 'SafeTrade - Login',
        path: 'login',
        component: Login
    },
    {
        title: 'SafeTrade - Verify Email',
        path: 'verify-email/:verifyToken',
        component: VerifyEmail
    },
    {
        title: 'SafeTrade - Change Password',
        path: 'change-password/:verifyToken',
        component: ChangePassword
    },
    {
        title: 'SafeTrade - Delete Account',
        path: 'delete-account/:deleteToken',
        component: DeleteAccount
    },
    {
        title: 'SafeTrade - Chat Room',
        path: 'chat-room/:chatRoomId',
        component: ChatRoom,
        canActivate: [AuthGuard]
    },
    {
        title: 'SafeTrade - Admin Dashboard',
        path: 'admin/dashboard',
        component: Home,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        title: 'SafeTrade - Admin Sellers',
        path: 'admin/sellers',
        component: ManageSellers,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        title: 'SafeTrade - Admin Deals',
        path: 'admin/deals',
        component: ManageDeals,
        canActivate: [AuthGuard, AdminGuard]
    },
    {
        title: 'SafeTrade - Home',
        path: '**',
        redirectTo: 'home'
    },
];
