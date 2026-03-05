import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Chat } from './pages/chat/chat';
import { Profile } from './pages/profile/profile';
import { Tracking } from './pages/tracking/tracking';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'chat', component: Chat },
    { path: 'tracking', component: Tracking },
    { path: 'profile', component: Profile }
];
