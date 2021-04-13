import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthorizationService } from '../authentication/authorization.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  notificationMessage!: string;
  user: User;
  private userSub!: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthorizationService,
    private router: Router
    ) {
    this.user = this.userService.loggedInUser;
  }

  ngOnInit() {
    this.userSub = this.authService.userAuth.subscribe(userAuth => {
      this.isAuthenticated = !!userAuth;
    });

    this.userService.updatedLoggedInUserInfo.subscribe(
      (user: User) => {
        this.user = user;
      }
    );
    // if (this.user == null) {
    //   this.checkUser().then(
    //     (response: boolean) => {
    //       if (!response) {
    //         this.router.navigate(['add-user-info']);
    //        }
    //     }
    //   );
    // }
  }

  checkUser() {
    let userAlreadyExists = false;
    return new Promise((resolve, reject) => {
    this.userService.getUsers()
     .subscribe(
       (response) => {
         for (const id in response) {
          if (response[id].SocialId === localStorage.getItem('SocialId')) {
            userAlreadyExists = true;
            this.user = response[id];
          }
         }
         resolve(userAlreadyExists);
       }
     );
    });
  }

  onEditProfile() {
    this.router.navigate(['/update-user-info/' + this.user.SocialId]);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
