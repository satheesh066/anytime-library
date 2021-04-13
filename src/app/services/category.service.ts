import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { UrlService } from './url.service';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {
    url!: string;
    constructor(
        private http: HttpClient,
        private urlService: UrlService
    ) {}

    getCategories(): Observable<Category[]> {
        this.url = this.urlService.generateUrl('categories.json');
        return this.http.get<{[id:string]: Category}>(this.url)
            .pipe(
                map(
                    (response) => {
                        const categories: Category[] = [];
                        for (const id in response) {
                            if (response.hasOwnProperty(id)) {
                                categories.push(response[id]);
                            }
                        }
                        return categories;
                    }
                ),
                catchError(error => {
                    console.log(error);
                    return throwError(error);
                })
            );
    }

    postCategory(category: Category) {
        this.url = this.urlService.generateUrl('categories.json');
        return this.http.post(this.url, category)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }

    updateCategory(category: Category, id: string) {
        this.url = this.urlService.generateUrl('categories' + id + '.json');
        return this.http.put(this.url, category)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }

    deleteCategory(id: string) {
        this.url = this.urlService.generateUrl('categories' + id + '.json');
        return this.http.delete(this.url)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }
}
