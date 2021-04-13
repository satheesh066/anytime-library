import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  ids: string[];
  isShowUserBooks: boolean;
  users: User[];
  viewUserMailId!: string;
  viewUserName!: string;
  loading: boolean;
  constructor(private userService: UserService,
    private router: Router) {
      this.isShowUserBooks = false;
      this.users = [];
      this.ids = [];
      this.loading = true;
    }

  ngOnInit() {
    this.users = [];
    this.ids = [];
    this.userService.getUsers()
        .subscribe(
          (response: {[key: string]: User}) => {
            response = (response != null) ? response : {};
            for (const id in response) {
              if (response.hasOwnProperty(id)) {
                this.users.push(response[id]);
                this.ids.push(id);
              }
            }
            this.userService.users = this.users;
            this.loading = false;
        }
      );
  }

  onEdit(socialId: string) {
    this.router.navigate(['/users/update-user', socialId]);
  }

  onViewBooks(user: User) {
    this.router.navigate(['users/view-user-books', user.SocialId, user.Name]);
  }

}
