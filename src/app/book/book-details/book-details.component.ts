import { Component, OnInit, ViewContainerRef, NgModule, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { IssuedBook } from '../../models/issuedBook';
import { FireBook } from '../../models/fireBook';
import { UserRating } from '../../models/userRating';
import { NotificationService } from '../../services/notification.service';
import { IssuedBooksService } from '../../services/issued-books.service';
import { BookReviewService } from '../../services/book-review.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  userRating:  UserRating;
  userRatings: UserRating[];
  fireBook!: FireBook;
  id!: string;
  userMailId!: string;
  userRole!: string;
  userName!: string;
  isIssueBook: boolean;
  bookToIssue!: IssuedBook;
  issuedBooks: IssuedBook[];
  books!: Book[];
  isAlreadyIssued: boolean;
  viewRating = false;

  constructor(private activeRoute: ActivatedRoute,
    private bookService: BookService,
    private issuedBooksService: IssuedBooksService,
    private bookReviewService: BookReviewService,
    private router: Router,
    private notificationService: NotificationService,
    private modalService: NgbModal
    ) {
      this.isIssueBook = false;
      this.isAlreadyIssued = false;
      this.userRatings = [];
      this.userRating = new UserRating('', 5, '', this.userName, this.userMailId, new Date(), '');
      this.fireBook = this.initializeFireBook();
      this.issuedBooks = [];
      this.getIssedBooks();
  }

  ngOnInit() {
    this.userMailId = localStorage.getItem('SocialId')!;
    this.userRole = localStorage.getItem('Role')!;
    this.userName = localStorage.getItem('UserName')!;
    this.id = this.activeRoute.snapshot.params['id'];
    this.bookService.getBook(this.id)
      .subscribe(
        (response: any) => {
          response = response.length !== 0 ? response : {};
          const fireBook = this.bookService.convertToFireBook(response, this.id);
          this.fireBook = fireBook;
          this.initializeBookToIssue();
          this.getAllRatings();
      });
  }

  initializeBookToIssue() {
    this.bookToIssue = {
      Id: this.fireBook.Id,
      Authors: this.fireBook.Authors,
      Isbn: this.fireBook.Isbn,
      Category: this.fireBook.Category,
      IssuedDate: new Date(),
      IssuedTo: this.userMailId,
      NoOfCopies: 1,
      ReturnDate: new Date(),
      Title: this.fireBook.Title,
      ImageUrl: this.fireBook.ImageUrl
    };
  }

  getAllBooks() {
    this.bookService.getAllBooks()
      .subscribe(
        (response: FireBook[]) => {
          this.books = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onEdit() {
    this.bookService.bookToUpdate = this.fireBook;
    this.router.navigate(['/book/update-book']);
  }

  onDelete() {
    this.bookService.deleteBook(this.fireBook.Id)
      .subscribe(
        (response: any) => {
          this.notificationService.showSuccessNotification('Book Deleted Successfully');
          this.router.navigate(['/book/view-books']);
        },
        (error) => {
          console.log(error);
          this.notificationService.showErrorNotification('Error while deleting book');
        }
      );
  }

  onRedirect() {
    this.router.navigate(['book/view-books']);
  }

  onIssueBook() {
    this.issuedBooks.forEach(
      (issuedBook) => {
        if ((issuedBook.Isbn === this.bookToIssue.Isbn) &&
              (issuedBook.IssuedTo === this.userMailId)) {
          this.isAlreadyIssued = true;
        }
      }
    );
    if (!this.isAlreadyIssued) {
      const dupDate = new Date();
      dupDate.setDate(dupDate.getDate() + 10);
      this.bookToIssue.ReturnDate = dupDate;
      this.issuedBooks.push(this.bookToIssue);
      this.issuedBooksService.issuedBooks.push(this.bookToIssue);
      this.issuedBooksService.addUpdateIssuedBooks(this.bookToIssue)
        .subscribe(
          (response) => {
            if (response !== null) {
              this.updateBooks();
              this.notificationService.showSuccessNotification('Book issued Successfully');
              this.router.navigate(['/book/book-history']);
            }else {
              this.notificationService.showErrorNotification('Error occured while issuing book');
            }
          },
          (error) => {
            console.error(error);
            this.notificationService.showErrorNotification('Error occured while issuing book');
          }
        );
    } else {
      this.notificationService.showWarningNotification('Book already issued, cannot issue more than one book');
    }
  }

  updateBooks(): any {
    this.fireBook.Quantity -= 1;
    const book = this.bookService.convertToBook(this.fireBook);
    this.bookService.updateBook(book, this.fireBook.Id)
      .subscribe(
        (response) => {
        },
        (error) => {
          console.log(error);
        });
  }

  getIssedBooks() {
    this.issuedBooksService.getIssuedBooks()
      .subscribe(
        (response: any) => {
          if (response === null) {
            this.issuedBooks = [];
          }else {
            for (const id in response) {
              if (response.hasOwnProperty(id)) {
                this.issuedBooks.push(response[id]);
              }
            }
          }
        });
  }

  getAllRatings() {
    this.bookReviewService.getAllRatings()
      .subscribe(
        (response: UserRating[]) => {
          for (const rating of response) {
              if (rating.Isbn === this.fireBook.Isbn) {
                this.userRatings.push(rating);
              }
            }
          });
  }

  onRatingSubmit() {
    this.fireBook.AvgRating = (this.fireBook.AvgRating + this.userRating.Rating) / 2;
    const book = this.bookService.convertToBook(this.fireBook);
    // update the book rating in books collections
    this.bookService.updateBook(book, this.fireBook.Id);
    this.userRating.Isbn = this.fireBook.Isbn;
    this.userRating.SubmittedOn = new Date();
    this.userRating.SubmittedBy = this.userMailId;
    this.userRating.Name = this.userName;
    // post new ratign of the book
    this.bookReviewService.postUserRating(this.userRating)
      .subscribe(
        (response) => {
          if (response !== null) {
            this.userRatings.push(this.userRating);
            this.notificationService.showSuccessNotification('Review submitted Successfully');
            this.userRating = {
              Name: this.userName,
              Rating: 0,
              SubmittedBy: this.userMailId,
              Isbn: this.fireBook.Isbn,
              Review: '',
              SubmittedOn: new Date(),
              Title: ''
            };
          }else {
            this.notificationService.showErrorNotification('Error occured while submitting review');
          }
        },
        (error) => {
          console.error(error);
          this.notificationService.showErrorNotification('Error occured while submitting review');
        }
      );
  }

  initializeFireBook(): FireBook {
    const fireBook = {
      Id: '',
      Authors: '',
      Description: '', Isbn: '', ImageUrl: '',
      Category: '',
      Location: '', Quantity: 0, Title: '', AvgRating: 0
    };
    return fireBook;
  }

  onRatingChange(event: any) {
    this.userRating.Rating = event.newValue;
  }

  triggerReview(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      debugger;
      this.onRatingSubmit();
    },(reason) => {
      this.viewRating = false;
      this.userRating = {
        Name: this.userName,
        Rating: 0,
        SubmittedBy: this.userMailId,
        Isbn: this.fireBook.Isbn,
        Review: '',
        SubmittedOn: new Date(),
        Title: ''
      };
    });
  }

  setShowRating(userRating: UserRating) {
    this.viewRating = true;
    this.userRating = userRating;
  }

  ngOnDestroy() {
  }
}
