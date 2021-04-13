import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { Book } from '../../models/book';
import { FireBook } from '../../models/fireBook';
import { NotificationService } from '../../services/notification.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add-update-book',
  templateUrl: './add-update-book.component.html',
  styleUrls: ['./add-update-book.component.css']
})
export class AddUpdateBookComponent implements OnInit, OnDestroy {
  fireBook: FireBook;
  bookToStore!: Book;
  storedBooks: FireBook[];
  searchParameter!: string;
  shouldEnable: boolean;
  message!: string;
  validISBN: boolean;
  isDuplicateBook: boolean;
  categories: Category[];
  loading: boolean;

  constructor(private bookService: BookService,
    private router: Router,
    private notificationService: NotificationService,
    private categoryService: CategoryService) {
      this.validISBN = true;
      this.isDuplicateBook = false;
      this.fireBook = this.initializeFireBook();
      this.storedBooks = [];
      this.shouldEnable = false;
      this.categories = [];
      this.loading = false;
      this.getCategories();
      this.getAllBooks();
  }

  ngOnInit() {
    if (this.router.url.indexOf('add-book') !== -1) {
      this.shouldEnable = true;
      this.searchParameter = 'JPDOSzE7Bo0C';
    }else {
      if (this.bookService.bookToUpdate !== undefined) {
        this.fireBook = this.bookService.bookToUpdate;
      }else {
        this.router.navigate(['book/view-books']);
      }
    }
  }

  getAllBooks() {
    this.bookService.getAllBooks()
        .subscribe(
          (response: any) => {
            response = (response != null) ? response : [];
            for (const id in response) {
                if (response.hasOwnProperty(id)) {
                const fireBook = this.bookService.convertToFireBook(response[id], id);
                this.storedBooks.push(fireBook);
              }
            }
        }
      );
  }

  postCategory() {
    const category: Category = new Category('Fantasy');
    this.categoryService.postCategory(category)
      .subscribe(
        (response) => {
        }
      );
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe(
        (response) => {
          for (const id in response) {
            if (response.hasOwnProperty(id)) {
              this.categories.push(response[id]);
            }
          }
        }
      );
  }

  searchBook() {
    this.loading = true;
    this.validISBN = true;
    this.bookService.getBookFromGoogle(this.searchParameter)
      .subscribe(
        (response: any) => {
          const volumeInfo = response.volumeInfo;
          this.fireBook = {
            Id: '',
            Isbn : response.id,
            Title : volumeInfo.title,
            Authors : volumeInfo.authors,
            Description : volumeInfo.description,
            ImageUrl: volumeInfo.imageLinks.thumbnail,
            Category: '',
            Location : '',
            Quantity : 0,
            AvgRating: volumeInfo.averageRating
          };
          this.loading = false;
        }, (error) => {
          this.validISBN = false;
          this.loading = false;
          this.fireBook = this.initializeFireBook();
          this.fireBook.Isbn = this.searchParameter;
        }
      );
  }

  onSubmit() {
    const that = this;
    if (this.fireBook.Location === '') {
      this.fireBook.Location = 'Unknown';
    }
    this.bookToStore = this.bookService.convertToBook(this.fireBook);
    if (this.router.url.indexOf('update-book') !== -1) {
      this.bookService.updateBook(this.bookToStore, this.fireBook.Id)
        .subscribe(
          (response) => {
            if (response !== null) {
              this.message = 'Book Details updated successfully';
              this.bookService.fireBookDetails = this.fireBook;
              this.router.navigate(['/book/book-details', this.fireBook.Id]);
              this.notificationService.showSuccessNotification(this.message);
            } else {
              that.notificationService.showErrorNotification('Error while adding/updating book details');
            }
          }
        );
    } else {
      this.storedBooks.forEach(
        (fireBook, index) => {
          if (fireBook.Isbn === this.fireBook.Isbn) {
            this.isDuplicateBook = true;
          }
        }
      );
      if (!this.isDuplicateBook) {
        this.storedBooks.push(this.fireBook);
        this.bookService.addBook(this.bookToStore)
          .subscribe(
            (response) => {
              this.fireBook = this.initializeFireBook();
              if (response !== null) {
                this.message = 'Book Details added successfully';
                this.router.navigate(['book/view-books']);
                this.notificationService.showSuccessNotification(this.message);
              } else {
                this.notificationService.showErrorNotification('Error while adding/updating book details');
              }
            },
            (error) => {
              console.log(error);
              this.notificationService.showErrorNotification('Error while adding/updating book details');
            }
          );
      } else {
        this.notificationService.showWarningNotification('Book is already present in the library');
      }
    }
  }

  onCancel() {
    this.router.navigate(['/book/view-books']);
  }

  initializeFireBook() {
    let fireBook: FireBook;
    return fireBook = {
      Id: '',
      Isbn: '',
      Authors: '',
      Description: '',
      ImageUrl: '',
      Category: '',
      Location: '',
      Quantity: 0,
      Title: '',
      AvgRating: 0
     };
  }

  ngOnDestroy() {
    this.bookService.bookToUpdate = {
      Id: '',
      Authors: '',
      Description: '', Isbn: '', ImageUrl: '',
      Category: '',
      Location: '', Quantity: 0, Title: '', AvgRating: 0
    };
  }

}
