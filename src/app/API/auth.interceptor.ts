import { Injectable } from '@angular/core';
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

  constructor(private readonly router: Router, private readonly LoadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // ?????? URL ?????????????? Global Loading
    const skipLoadingUrls = [
      '/chat/SendMessages',
      '/chat/MarkAsRead',
      '/core/GetNotifications',
      '/core/FindUsers',
      '/core/FindBanks',
      '/users/CheckAlreadyExistsEmail'
    ];

    // ?????????? URL ??????????????????????????????? loading ??????? ???????????????????? context
    const isSkipLoadingUrl = skipLoadingUrls.some(url => req.url.includes(url));
    const skipLoading = req.context.get(SKIP_LOADING) || isSkipLoadingUrl;

    if (!skipLoading) {
      this.LoadingService.show();
    }

    const token = localStorage.getItem('token');
    
    // ?????? URL ????????????? Auth Header (???? Login, SignUp)
    const skipAuthUrls = [
      '/api/users/Login',
      '/api/users/SignUp'
    ];

    const shouldSkipAuth = skipAuthUrls.some(url => req.url.includes(url));

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
        if (!skipLoading) {
          this.LoadingService.hide();
        }
      }),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
