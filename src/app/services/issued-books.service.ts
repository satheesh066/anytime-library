import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { FireBook } from '../models/fireBook';

import { IssuedBook } from '../models/issuedBook';
import { UrlService } from './url.service';

@Injectable()
export class IssuedBooksService {
    url: string;
    collectionName: string;
    issuedBooks: IssuedBook[];
    constructor(
        private urlService: UrlService,
        private http: HttpClient
        ) {
        this.url = '';
        this.issuedBooks = [];
        this.collectionName = environment.issuedBooksCollection;
    }

    updatedIssuedBooks = new EventEmitter<IssuedBook[]>();

    getIssuedBooks(): Observable<any> {
        this.url = this.urlService.generateUrl(this.collectionName + '.json');
        return this.http.get(this.url)
        .pipe(
            map(response => {
                return response;
            }),
            catchError(error => {
                console.log(error);
                return throwError(error);
            })
        );
    }

    updateIssuedBook(issuedBook: IssuedBook, id: string) {
        this.url = this.urlService.generateUrl('issuedBooks/' + id + '.json');
        return this.http.put(this.url, issuedBook)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

    addUpdateIssuedBooks(issuedBook: IssuedBook) {
        this.url = this.urlService.generateUrl(this.collectionName + '.json');
        return this.http.post(this.url, issuedBook)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

    deleteIssudBook(id: string) {
        this.url = this.urlService.generateUrl('issuedBooks/' + id + '.json');
        return this.http.delete(this.url)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

}
