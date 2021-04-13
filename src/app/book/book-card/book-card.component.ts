import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FireBook } from '../../models/fireBook';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit {

  @Input() fireBook!: FireBook;

    constructor(
      private router: Router, 
      private bookSevice: BookService
    ) { }

    ngOnInit() {
    }

    getLink() {
      this.bookSevice.fireBookDetails = this.fireBook;
      this.router.navigate(['/book/book-details', this.fireBook.Id]);
    }

}
