import { Injectable, EventEmitter } from '@angular/core';

import { UrlService } from '../services/url.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
    url!: string;
    users: User[];
    loggedInUser!: User;

    constructor(private http: HttpClient,
        private urlService: UrlService) {
            this.users = [];
        }

    updatedLoggedInUserInfo = new EventEmitter<User>();
    getUsers() {
        this.url = this.urlService.generateUrl('users.json');
        return this.http.get<{[key: string]: User}>(this.url);
    }

    addUser(user: User) {
        this.url = this.urlService.generateUrl('users.json');
        return this.http.post(this.url, user).pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }

    updateUser(user: User, id: string) {
        this.url = this.urlService.generateUrl('users/' + id + '.json');
        return this.http.put(this.url, user)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }
}
