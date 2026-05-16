import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from '../core/LoadingService';
import { SKIP_LOADING } from '../core/LoadingContext';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  private readonly skipLoadingRoutes = [
    '/chat-room'
  ];

  private readonly skipAuthUrls = [
    '/api/users/Login',
    '/api/users/SignUp'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isSkipLoading = req.context.get(SKIP_LOADING) || 
                         this.skipLoadingRoutes.some(route => this.router.url.includes(route));

    if (!isSkipLoading) {
      this.loadingService.show();
    }

    const token = localStorage.getItem('token');
    const shouldSkipAuth = this.skipAuthUrls.some(url => req.url.includes(url));

    let authReq = req;
    if (token && !shouldSkipAuth) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      finalize(() => {
        if (!isSkipLoading) {
          this.loadingService.hide();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          this.loadingService.reset(); 
        }
        return throwError(() => error);
      })
    );
  }
}
