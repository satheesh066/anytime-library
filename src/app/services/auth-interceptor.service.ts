import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AuthorizationService } from "../authentication/authorization.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthorizationService) {}

    intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.userAuth.pipe(
            take(1),
            exhaustMap(user => {
              if (!user) {
                return next.handle(req);
              }
              const modifiedReq = req.clone({
                params: new HttpParams().set('auth', user.token!)
              });
              return next.handle(modifiedReq);
            })
        );
    }
}