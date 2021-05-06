import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import *as _ from 'lodash';
import { AuthResponseData } from '../models/authResponseData';
import { User } from '../models/user';
import { NotificationService } from '../services/notification.service';
import { UserService } from '../services/user.service';
import { AuthorizationService, } from './authorization.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  error!: string;
  currentUser!: User;

  constructor(private authService: AuthorizationService,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        if(!this.isLoginMode){
            this.adduser(email);
        }
        else{
            this.getUserInfo(email).then(resp => {
              this.router.navigate(['/book/view-books']);
            })
        }
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
      }
    );

    form.reset();
  }

  adduser(email: string) {
    const user : User = {
        Id: '',
        Name: '',
        Role: 'User',
        FavoriteGenres: [],
        Friends: '',
        Picture: '',
        SocialId: email
    };

    this.userService.addUser(user)
      .subscribe(
        (response) => {
          if (response !== null) {
            this.userService.users.push(user);
            localStorage.setItem('UserName', user.Name);
            this.notificationService.showSuccessNotification("User signup successfull");
            this.router.navigate(['book/view-books']);
          } else {
            this.notificationService.showErrorNotification('Error while registering user');
            this.router.navigate(['/auth']);
          }
        },
        (error) => {
            console.log(error);
            this.notificationService.showErrorNotification('Error while registering user');
            this.router.navigate(['/auth']);
        }
      );
  }

  getUserInfo(email: string) {
    return new Promise((resolve, reject) => {
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
                        if (_.isEqual(user.SocialId, email)) {
                            this.currentUser = user;
                            this.userService.loggedInUser = user;
                            this.userService.updatedLoggedInUserInfo.emit(user);
                            localStorage.setItem('Role', user.Role);
                            localStorage.setItem('SocialId', user.SocialId);
                            localStorage.setItem('UserName', user.Name);
                            localStorage.setItem('Picture', user.Picture);
                        }
                        resolve(this.currentUser);
                    }
                );
            });
        });
    }
}
