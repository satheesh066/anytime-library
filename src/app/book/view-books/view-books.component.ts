import { Component, OnInit, Input } from '@angular/core';
import { BookService } from '../../services/book.service';
import { FireBook } from '../../models/fireBook';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';

@Component({
  selector: 'app-view-books',
  templateUrl: './view-books.component.html',
  styleUrls: ['./view-books.component.css']
})
export class ViewBooksComponent implements OnInit {

  fireBooks: FireBook[];
  userRole: string;
  categories: Category[];
  Category: string;
  userName: string;
  userAlreadyExists: boolean;
  searchText!: string
  messageToDisplay: string;
  constructor(
    private bookService: BookService,
    private categoryService: CategoryService
    ) {
      this.userName = localStorage.getItem('UserName')!;
      this.fireBooks = [];
      this.categories = [];
      this.userRole = localStorage.getItem('Role')!;
      this.Category = 'Select Category';
      this.getCategories();
      this.userAlreadyExists = false;
      this.messageToDisplay = "Fetching available books, please wait..";
   }

  ngOnInit() {
    this.bookService.getAllBooks()
      .subscribe(
        (response) => {
          if (response != null) {
            this.fireBooks = response;
          } else {
            this.messageToDisplay = "No Books available in the store";
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe(
        (response) => {
          this.categories = response;
        }
      );
  }

}
