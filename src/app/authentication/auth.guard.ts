import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { AuthorizationService } from './authorization.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private router: Router,
        private authService: AuthorizationService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('userData') !== null) {
            return true;
        } else {
            this.router.navigate(['/auth']);
            return false;
        }
    }
}
