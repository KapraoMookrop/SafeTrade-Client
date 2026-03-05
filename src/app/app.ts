import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from "@angular/router";
import { Navbar } from './component/navbar/navber';
import { AppStateService } from './core/AppStateService';
import { UserClientData } from './types/UserClientData';
import { AuthService } from './core/AuthService';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  token?: string;

  constructor(public authService: AuthService, public stateService: AppStateService, public router: Router) { }

  hideNavbarRoutes = ['/login', '/register'];

  shouldShowNavbar() {
    return !this.hideNavbarRoutes.includes(this.router.url);
  }

  ngOnInit() {
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    this.token = localStorage.getItem('token') || undefined;
    if (this.token) {
      const decodeJwt = this.decodeJwt(this.token);
      const userClient = {
        UserId: decodeJwt.userId,
        FullName: decodeJwt.fullName,
      } as UserClientData;

      this.authService.login(this.token, userClient);

    } else {
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

  decodeJwt(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

}