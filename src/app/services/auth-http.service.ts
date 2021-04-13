import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

// import { Adal4Service } from 'adal-angular4';

@Injectable()
export class AuthHttpService {

    constructor(
        // private auth: Adal4Service, 
        private http: HttpClient
    ) { }

    // public get(url): Observable<Response> {
    //     const headers: Headers = new Headers();
    //     headers.append('Authorization', `Bearer ${this.auth.userInfo.token}`);

    //     return this.http.get(url, new RequestOptions({ headers: headers }));
    // }
    public get(url: string): Observable<any> {
        return this.http.get(url)
            .pipe(
                catchError(error => {
                        console.log(error);
                        return Observable.throw('Error while fetching data from google api');
                }));
    }
    public post(url: string, data: any): Observable<any> {
        // const headers: Headers = new Headers({'content-Type': 'application/json'});
        // const options: RequestOptions = new RequestOptions({headers: headers});
        // return this.http.post(url, JSON.stringify(data), options);
        return this.http.post(url, data)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }
    public put(url: string, data: any): Observable<any> {
        return this.http.put(url, data)
            .pipe(
                catchError(error => {
                    console.log(error);
                    return error;
                })
            );
    }
    public delete(url: string): Observable<any> {
        return this.http.delete(url)
        .pipe(
            catchError(error => {
                console.log(error);
                return error;
            })
        );
    }
}
