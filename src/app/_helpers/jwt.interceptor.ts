import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt auth token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.authToken}`
        }
      });
    }

    return next.handle(request);
  }
}
