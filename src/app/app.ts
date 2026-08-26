import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Navbar } from './component/navbar/navber';
import { AppStateService } from './core/AppStateService';
import { AuthService } from './core/AuthService';
import { filter } from 'rxjs/internal/operators/filter';
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

  constructor(public authService: AuthService,
    public stateService: AppStateService,
    public router: Router,
    private SocketService: SocketService,
    private ChatService: ChatService) { }

  showNavbarRoutes = ['/home', '/chat', '/tracking', '/profile', '/admin/dashboard', '/admin/sellers', '/admin/deals', '/admin/reports'];

  shouldShowNavbar() {
    return this.showNavbarRoutes.includes(this.router.url);
  }

  async ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(async (event: any) => {
      const url = event.urlAfterRedirects;

      const excludedUrls = ['/login', '/verify-email', '/change-password'];
      if (excludedUrls.some(path => url.startsWith(path))) return;

      const user = this.stateService.user();
      if (!user) return;

      if (user.Role === "ADMIN" && !url.startsWith('/admin') && !url.startsWith('/profile')) {
        this.router.navigate(['/admin/dashboard']);
        return;
      }

      if (!this.SocketService.isConnected()) {
        this.SocketService.connect();
      }
      this.SocketService.joinUser(this.stateService.userId() || '');
    });
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