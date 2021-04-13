import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-update-user',
  templateUrl: './add-update-user.component.html',
  styleUrls: ['./add-update-user.component.css']
})
export class AddUpdateUserComponent implements OnInit {

  user: User;
  message!: string;
  ids: string[];
  users: User[];
  categories: Category[];
  isEditable: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private categoryService: CategoryService
    ) {
      this.isEditable = true;
      this.ids = [];
      this.users = [];
      this.user = {
        Id: '',
        Name: '',
        Role: '',
        FavoriteGenres: [],
        Friends: '',
        Picture: '',
        SocialId: ''
      };
      this.categories = [];
      this.getAllCategories();
  }

  async ngOnInit() {
    await this.getAllUsers().then(response => {
      response = (response != null) ? response : {};
      this.users = [];
      this.ids = [];
      for (const id in response) {
        if (response.hasOwnProperty(id)) {
          this.users.push(response[id]);
          this.ids.push(id);
        }
      }
      this.userService.users = this.users;
    })

    if (this.router.url.indexOf('add-user-info') !== -1) {
      this.isEditable = false;
      this.user.Role = localStorage.getItem('Role')!;
      this.user.Name = localStorage.getItem('UserName')!;
      this.user.SocialId = localStorage.getItem('SocialId')!;
      if (this.user.Name !== null) {
        this.userService.users.forEach(
          (user: User, i) => {
            if (_.isEqual(user.SocialId, this.user.SocialId)) {
              this.user = user;
            }
          }
        );
      }
    } else if (this.router.url.indexOf('update-user') !== -1) {
      this.user.Id = this.activatedRoute.snapshot.params['id'];
      this.userService.users.forEach(
        (user: User) => {
          if (_.isEqual(user.SocialId, this.user.Id)) {
            this.user = user;
          }
        }
      );
    }
  }

  async getAllUsers() {
    return this.userService.getUsers().toPromise();
  }

  getAllCategories() {
    this.categoryService.getCategories()
      .subscribe(
        (response) => {
          this.categories = response;
        }
      );
  }

  onSubmit() {
    if (this.router.url.indexOf('update-user') !== -1) {
      this.updateUser();
    }else if (this.router.url.indexOf('add-user-info') !== -1) {
      const userName = localStorage.getItem('UserName');
      if (userName !== null) {
        this.updateUser();
        this.userService.loggedInUser = this.user;
        this.userService.updatedLoggedInUserInfo.emit(this.user);
      }else {
        this.adduser();
        this.userService.loggedInUser = this.user;
        this.userService.updatedLoggedInUserInfo.emit(this.user);
      }
    }else {
      this.adduser();
    }
  }

  updateUser() {
    let id: string;
    this.userService.users.forEach(
      (user: User, i) => {
        if (_.isEqual(user.SocialId, this.user.SocialId)) {
          this.userService.users[i] = this.user;
          id = this.ids[i];
        }
      }
    );
    this.userService.updateUser(this.user, id!)
      .subscribe(
        (response) => {
          if (response !== null) {
            this.message = 'User Details updated successfully';
            this.notificationService.showSuccessNotification(this.message);
            if (this.user.Role === 'Admin') {
              this.router.navigate(['users/view-users']);
            }else {
              this.router.navigate(['book/view-books']);
            }
          }else {
            this.notificationService.showErrorNotification('Error while updating book details');
          }
        },
        (error) => {
          console.log(error);
          this.notificationService.showErrorNotification('Error while updating book details');
        }
      );
  }

  adduser() {
    this.userService.addUser(this.user)
      .subscribe(
        (response) => {
          if (response !== null) {
            this.message = 'User Details added successfully';
            this.userService.users.push(this.user);
            localStorage.setItem('UserName', this.user.Name);
            this.notificationService.showSuccessNotification(this.message);
            if (this.user.Role === 'Admin') {
              this.router.navigate(['users/view-users']);
            }else {
              this.router.navigate(['book/view-books']);
            }
          }else {
            this.notificationService.showErrorNotification('Error while adding book details');
          }
        },
        (error) => {
          console.log(error);
          this.notificationService.showErrorNotification('Error while adding book details');
        }
      );
  }
}
