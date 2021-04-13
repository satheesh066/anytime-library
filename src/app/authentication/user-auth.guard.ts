import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { AuthorizationService } from './authorization.service';

@Injectable()
export class UserAuthGuard implements  CanActivate {
    constructor(private authService: AuthorizationService){
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authService.isAllowedToView(['Admin', 'User']);
     }
}
