import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from "rxjs/operators";
import { Observable } from 'rxjs';

import { FireBook } from '../models/fireBook';
import { UrlService } from './url.service';
import { Book } from '../models/book';


@Injectable()
export class BookService {
    url!: string;
    bookToUpdate!: FireBook;
    fireBookDetails!: FireBook;
    collectionName!: string;

    constructor(private http: HttpClient,
        private urlService: UrlService) {
            this.collectionName = environment.booksCollection;
    }

    getBookFromGoogle(parameter: string) {
        return this.http.get('https://www.googleapis.com/books/v1/volumes/' + parameter)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

    getAllBooks(): Observable<FireBook[]> {
         this.url = this.urlService.generateUrl(this.collectionName + '.json');
         return this.http.get<{[key: string]: Book}>(this.url)
            .pipe(
                map(
                    (response) => {
                        const fireBooks: FireBook[] = [];
                        if (response != null) {
                            for (const id in response) {
                                if (response.hasOwnProperty(id)) {
                                    const fireBook = this.convertToFireBook(response[id], id);
                                    fireBooks.push(fireBook);
                                }
                            }
                        }
                        return fireBooks;
                    }
                )
            );
    }

    addBook(book: Book) {
        this.url = this.urlService.generateUrl(this.collectionName + '.json');
        return this.http.post(this.url, book)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }

    getBook(id: string) {
        this.url = this.urlService.generateUrl('books/' + id + '.json');
        return this.http.get(this.url)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return Observable.throw('Error while fetching data from google api');
                })
            );
    }

    updateBook(book: Book, id: string) {
        this.url = this.urlService.generateUrl('books/' + id + '.json');
        return this.http.put(this.url, book)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );;
    }

    deleteBook(id: string) {
        this.url = this.urlService.generateUrl('books/' + id + '.json');
        return this.http.delete(this.url)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

    convertToBook(fireBook: FireBook): Book {
        const book = new Book(
            fireBook.Isbn,
            fireBook.Title,
            fireBook.Authors,
            fireBook.Description,
            fireBook.ImageUrl,
            fireBook.Category,
            fireBook.Location,
            fireBook.Quantity,
            fireBook.AvgRating,

        );
        return book;
    }

    convertToFireBook(book: Book, id: string) {
        const fireBook = new FireBook(
            id,
            book.Isbn,
            book.Title,
            book.Authors,
            book.Description,
            book.ImageUrl,
            book.Category,
            book.Location,
            book.Quantity,
            book.AvgRating
        );
        return fireBook;
    }
}
