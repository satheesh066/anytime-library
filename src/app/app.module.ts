import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RatingModule } from 'ng-starrating';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserBooksPipe } from './pipes/user-books.pipe';
import { BookIsbnPipe } from './pipes/book-isbn.pipe';
import { CategoryPipe } from './pipes/category.pipe';
import { SearchBookPipe } from './pipes/search-book.pipe';
import { DropDownDirective } from './directives/dropdown.directive';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { CommonModule } from '@angular/common';
import { UrlService } from './services/url.service';
import { BookService } from './services/book.service';
import { CategoryService } from './services/category.service';
import { ViewBooksComponent } from './book/view-books/view-books.component';
import { BookCardComponent } from './book/book-card/book-card.component';
import { BookComponent } from './book/book.component';
import { IssuedBooksService } from './services/issued-books.service';
import { BookReviewService } from './services/book-review.service';
import { BookDetailsComponent } from './book/book-details/book-details.component';
import { BookHistoryComponent } from './book/book-history/book-history.component';
import { AddUpdateBookComponent } from './book/add-update-book/add-update-book.component';
import { UserService } from './services/user.service';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewUsersComponent } from './manage-users/view-users/view-users.component';
import { AddUpdateUserComponent } from './manage-users/add-update-user/add-update-user.component';
import { ViewUserBooksComponent } from './manage-users/view-user-books/view-user-books.component';
import { HeaderComponent } from './header/header.component';
import { AuthorizationService } from './authentication/authorization.service';
import { AuthSecretService } from './authentication/auth-secret.service.';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthComponent } from './authentication/auth.component';
import { AdminAuthGuard } from './authentication/admin-auth.guard';
import { UserAuthGuard } from './authentication/user-auth.guard';
import { LoggedInGuard } from './authentication/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    DropDownDirective,
    BookIsbnPipe,
    CategoryPipe,
    SearchBookPipe,
    UserBooksPipe,
    BookComponent,
    BookCardComponent,
    ViewBooksComponent,
    BookDetailsComponent,
    BookHistoryComponent,
    AddUpdateBookComponent,
    ManageUsersComponent,
    ViewUsersComponent,
    AddUpdateUserComponent,
    ViewUserBooksComponent,
    HeaderComponent,
    AuthComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RatingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    NgHttpLoaderModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    AuthorizationService,
    AuthSecretService,
    AdminAuthGuard,
    UserAuthGuard,
    LoggedInGuard,
    NotificationService,
    UrlService,
    BookService,
    CategoryService,
    IssuedBooksService,
    BookReviewService,
    UserService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
