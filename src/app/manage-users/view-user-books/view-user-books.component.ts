import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { IssuedBook } from '../../models/issuedBook';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { IssuedBooksService } from '../../services/issued-books.service';

@Component({
  selector: 'app-view-user-books',
  templateUrl: './view-user-books.component.html',
  styleUrls: ['./view-user-books.component.css']
})
export class ViewUserBooksComponent implements OnInit, OnChanges {
  socialId!: string;
  userName!: string;
  users: User[];
  issuedBooks!: IssuedBook[];
  currentUser: User;
  selectedId: string;
  searchText!: string;
  constructor(
    private issuedBooksService: IssuedBooksService,
    private userService: UserService) {
      this.users = [];
      this.currentUser = {
        FavoriteGenres: [],
        Friends: '',
        Id: '',
        Name: localStorage.getItem('UserName')!,
        Picture: '',
        Role: "Admin",
        SocialId: "Satheesh@gmail.com"
      };
      this.selectedId = "Satheesh@gmail.com";
  }

  ngOnInit() {
    this.issuedBooks = this.issuedBooksService.issuedBooks;
    if (this.userService.users.length === 0) {
      this.userService.getUsers()
      .subscribe(
        (response) => {
          for (const id in response) {
            if (response.hasOwnProperty(id)) {
              this.userService.users.push(response[id]);
            }
          }
          this.users = this.userService.users;
          this.currentUser = this.users[0];
        }
      );
    }else {
      this.users = this.userService.users;
      this.currentUser = this.users[0];
    }
    this.issuedBooksService.updatedIssuedBooks
      .subscribe(
        (updatedIssuedBooks) => {
          this.issuedBooks = updatedIssuedBooks;
        }
      );
      this.getAllIssuedBooks();
  }

  getAllIssuedBooks() {
    this.issuedBooks = [];
    this.issuedBooksService.getIssuedBooks()
      .subscribe(
        (response) => {
          response = (response !== null || response !== undefined) ? response : [];
          for (const id in response) {
            if (response.hasOwnProperty(id)) {
              this.issuedBooks.push(response[id]);
            }
          }
        }
      );
  }

  ngOnChanges(changes: any) {
    this.socialId = changes.socialId.currentValue;
  }

}
