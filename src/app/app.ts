import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Navbar } from './component/navbar/navber';
import { AppStateService } from './core/AppStateService';
import { UserClientData } from './types/UserClientData';
import { AuthService } from './core/AuthService';
import { filter } from 'rxjs/internal/operators/filter';
import { jwtDecode } from "jwt-decode";
import { KycStatus, UserRole, UserStatus } from './types/Enum';
import { SocketService } from './API/SocketService';
import { ChatService } from '../app/core/ChatService';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Navbar, RouterOutlet, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  token?: string;

  constructor(public authService: AuthService,
    public stateService: AppStateService,
    public router: Router,
    private SocketService: SocketService,
    private ChatService: ChatService) { }

  showNavbarRoutes = ['/home', '/chat', '/tracking', '/profile'];

  shouldShowNavbar() {
    return this.showNavbarRoutes.includes(this.router.url);
  }

  async ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: any) => {
      const url = event.urlAfterRedirects;

      if (url.startsWith('/verify-email') || url.startsWith('/change-password') || url.startsWith('/delete-account')) {
        return;
      }

      await this.loadUserFromToken();
      if (!this.SocketService.isConnected()) {
        this.SocketService.connect();
      }
      this.SocketService.joinUser(this.stateService.userId() || '');
    });
  }

  async loadUserFromToken() {
    this.token = localStorage.getItem('token') || undefined;

    if (!this.token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const decodeJwt = jwtDecode<JwtPayload>(this.token);

      const userClient: UserClientData = {
        Email: decodeJwt.email,
        FullName: decodeJwt.fullName,
        Role: decodeJwt.role,
        Phone: decodeJwt.phone,
        KycStatus: decodeJwt.kycStatus,
        UserStatus: decodeJwt.userStatus,
        IsEnabled2FA: decodeJwt.isEnabled2FA
      };

      this.authService.SetUserClient(this.token, userClient, decodeJwt.userId);

    } catch (err) {
      console.error('Invalid token', err);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.waitAndUpdate();
  }

  waitAndUpdate() {
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.updateContentPadding();
      });
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.waitAndUpdate();
  }

  updateContentPadding() {
    const nav = document.querySelector('app-navbar nav') as HTMLElement;
    const content = document.querySelector('.main-content') as HTMLElement;

    if (nav && content) {
      content.style.paddingTop = `${nav.offsetHeight}px`;
    }
  }
}

interface JwtPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone: string;
  kycStatus: KycStatus;
  userStatus: UserStatus;
  isEnabled2FA: boolean;
}