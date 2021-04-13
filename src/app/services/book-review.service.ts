import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { UrlService } from './url.service';
import { UserRating } from '../models/userRating';


@Injectable()
export class BookReviewService {
    url: string;
    collectionName: string;
    reviewsUpdated = new EventEmitter<UserRating[]>();

    constructor(
        private urlService: UrlService,
        private http: HttpClient
    ) {
        this.url = '';
        this.collectionName = environment.userRatingCollection;
    }

    getAllRatings() {
        this.url = this.urlService.generateUrl(this.collectionName + '.json');
        return this.http.get<{[id: string]: UserRating}>(this.url)
                .pipe(
                    map(
                        (response) => {
                            response = (response !== undefined || response !== null) ? response : {};
                            const userRatings: UserRating[] = [];
                            for (const id in response) {
                                if (response.hasOwnProperty(id)) {
                                    userRatings.push(response[id]);
                                }
                            }
                            return userRatings;
                        }
                    ),
                    catchError(error => {
                        console.log(error);
                        return throwError('Error while fetching ratings from google api');
                    }));;
    }

    postUserRating(userRating: UserRating) {
        this.url = this.urlService.generateUrl(this.collectionName + '.json');
        return this.http.post(this.url, userRating)
                .pipe(
                    catchError(error => {
                        console.log(error);
                        return throwError(error);
                    })
                );
    }
}
