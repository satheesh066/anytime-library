import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { BookService } from '../../services/book.service';
import { IssuedBook } from '../../models/issuedBook';
import { NotificationService } from '../../services/notification.service';
import { IssuedBooksService } from '../../services/issued-books.service';

@Component({
  selector: 'app-book-histoy',
  templateUrl: './book-history.component.html',
  styleUrls: ['./book-history.component.css']
})
export class BookHistoryComponent implements OnInit {

  userOwnBooks: IssuedBook[];
  issuedBooks: IssuedBook[];
  userMailId: string;
  ids: string[];
  loading: boolean;

  constructor(private bookService: BookService,
    private issuedBooksService: IssuedBooksService,
    private notificationService: NotificationService) {
    this.userOwnBooks = [];
    this.issuedBooks = [];
    this.userMailId = localStorage.getItem('SocialId')!;
    this.ids = [];
    this.loading = true;
   }

  ngOnInit() {
    this.issuedBooksService.getIssuedBooks()
      .subscribe(
        (response: any) => {
          if (response != null) {
            for (const id in response) {
              if (response.hasOwnProperty(id)) {
                if (this.userMailId === response[id].IssuedTo) {
                  this.issuedBooks.push(response[id]);
                  this.ids.push(id);
                }
              }
            }
            this.loading = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onRenew(renewBook: IssuedBook) {
    let renewBookId!: string;
    renewBook.ReturnDate = new Date(renewBook.ReturnDate);
    renewBook.ReturnDate.setDate( renewBook.ReturnDate.getDate() + 10 );
    this.issuedBooks.forEach(
      (issuedBook: IssuedBook, i) => {
        if (_.isEqual(issuedBook.Id, renewBook.Id)) {
          issuedBook.ReturnDate = renewBook.ReturnDate;
          renewBookId = this.ids[i];
        }
      });
    this.issuedBooksService.updateIssuedBook(renewBook, renewBookId)
      .subscribe(
        (response) => {
          if (response !== null) {
            this.notificationService.showInfoNotification('Book renewed Successfully');
            this.issuedBooksService.issuedBooks = this.issuedBooks;
            // this.issuedBooksService.updatedIssuedBooks.emit(this.issuedBooks);
          }else {
            this.notificationService.showErrorNotification('Error while updating renew details');
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onReturn(returnBook: IssuedBook) {
    let returnBookId!: string;
    this.issuedBooks.forEach(
      (issuedBook: IssuedBook, i) => {
        if (_.isEqual(issuedBook.Id, returnBook.Id)) {
          returnBookId = this.ids[i];
          this.ids.splice(i, 1);
          this.issuedBooks.splice(i, 1);
        }
      });
    this.issuedBooksService.deleteIssudBook(returnBookId)
    .subscribe(
      (response) => {
        this.notificationService.showInfoNotification('Book returned Successfully');
        this.updateBookDetails(returnBook.Id);
      },
      (error) => {
        console.log(error);
        this.notificationService.showErrorNotification('Error while returning book');
      }
    );
  }

  updateBookDetails(id: string) {
    this.bookService.getBook(id)
      .subscribe(
        (response: any) => {
          response = response.length !== 0 ? response : {};
            const book = response;
            book.Quantity += 1;
            this.bookService.updateBook(book, id)
              .subscribe(
                (updateResponse) => {
                },
                (error) => {
                  console.log(error);
                }
              );
        }
      );
  }
}
