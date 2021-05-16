import { EventEmitter, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { AuthResponseData } from "../models/authResponseData";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import * as _ from 'lodash';

import { UserAuthData } from "../models/userAuthData";
import { NotificationService } from "../services/notification.service";
import { User } from "../models/user";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
    userAuth = new BehaviorSubject<UserAuthData>(null!);
    private tokenExpirationTimer: any;
    updatedLoggedInUserInfo = new EventEmitter<User>();

    constructor(private http: HttpClient, 
        private router: Router,
        private notificationService: NotificationService,
        private userService: UserService) {
    }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD_V8bUdn9iGW8PJjU2oe91-DO2T52U4HQ',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(
                        response.email,
                        response.localId,
                        response.idToken,
                        +response.expiresIn
                    );
                })
            );
    }

    autoLogin() {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData')!);

        if (!userData) {
          return;
        }
    
        const loadedUser = new UserAuthData(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
    
        if (loadedUser.token) {
          this.userAuth.next(loadedUser);
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.autoLogout(expirationDuration);
        }

        this.userService.getUsers()
            .subscribe(
                (response: any) => {
                    const users: User[] = [];
                    for (const id in response) {
                        if (response.hasOwnProperty(id)) {
                            users.push(response[id]);
                        }
                    }
                    users.forEach(
                        (user: User) => {
                        if (_.isEqual(user.SocialId, localStorage.getItem('SocialId'))) {
                            this.userService.loggedInUser = user;
                            this.userService.updatedLoggedInUserInfo.emit(user);
                            localStorage.setItem('Role', user.Role);
                            localStorage.setItem('SocialId', user.SocialId);
                            localStorage.setItem('UserName', user.Name);
                            localStorage.setItem('Picture', user.Picture);
                        }
                    }
                );
            });
      }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD_V8bUdn9iGW8PJjU2oe91-DO2T52U4HQ',
                    {
                        email: email,
                        password: password,
                        returnSecureToken: true
                    }
                )
                .pipe(
                    catchError(this.handleError),
                    tap(response => {
                        this.handleAuthentication(
                            response.email,
                            response.localId,
                            response.idToken,
                            +response.expiresIn
                        );
                    })
                );
    }

    logout() {
        this.userAuth.next(null!);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
          clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this.notificationService.showSuccessNotification('Logged out successfully');
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new UserAuthData(email, userId, token, expirationDate);
        this.userAuth.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
        }
        return throwError(errorMessage);
    }

    isAllowedToView(roles: Array<string>) {
      var authStatus = false;
      const userRole = localStorage.getItem('Role');
      roles.forEach((role) => {
          if (role === userRole) {
              authStatus = true;
          }
      });
      if (!authStatus) {
        this.router.navigate(['unauthorizedUser']);
      }
      return authStatus;
    }
}
