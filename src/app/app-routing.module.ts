import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './authentication/admin-auth.guard';
import { AuthComponent } from './authentication/auth.component';
import { LoggedInGuard } from './authentication/auth.guard';
import { UserAuthGuard } from './authentication/user-auth.guard';
import { AddUpdateBookComponent } from './book/add-update-book/add-update-book.component';
import { BookDetailsComponent } from './book/book-details/book-details.component';
import { BookHistoryComponent } from './book/book-history/book-history.component';
import { BookComponent } from './book/book.component';
import { ViewBooksComponent } from './book/view-books/view-books.component';
import { AddUpdateUserComponent } from './manage-users/add-update-user/add-update-user.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ViewUserBooksComponent } from './manage-users/view-user-books/view-user-books.component';
import { ViewUsersComponent } from './manage-users/view-users/view-users.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  { path: '', redirectTo: 'book/view-books', pathMatch: 'full' },
  { path: 'book', component: BookComponent, canActivate: [LoggedInGuard],
        children: [
            { path: 'view-books', component: ViewBooksComponent, canActivate: [UserAuthGuard] },
            { path: 'book-details/:id', component: BookDetailsComponent, canActivate: [UserAuthGuard] },
            { path: 'add-book', component: AddUpdateBookComponent, canActivate: [AdminAuthGuard] },
            { path: 'update-book', component: AddUpdateBookComponent, canActivate: [AdminAuthGuard] },
            { path: 'book-history', component: BookHistoryComponent, canActivate: [UserAuthGuard] }
        ]
    },
    { path: 'users', component: ManageUsersComponent,
        children: [
            { path: 'view-users', component: ViewUsersComponent, canActivate: [AdminAuthGuard] },
            { path: 'add-user', component: AddUpdateUserComponent, canActivate: [AdminAuthGuard] },
            { path: 'update-user/:id', component: AddUpdateUserComponent, canActivate: [AdminAuthGuard] },
            { path: 'view-user-books', component: ViewUserBooksComponent, canActivate: [AdminAuthGuard] }
        ]
    },
    { path: 'add-user-info', component: AddUpdateUserComponent, canActivate: [LoggedInGuard] },
    { path: 'update-user/:id', component: AddUpdateUserComponent, canActivate: [LoggedInGuard] },
    { path: 'auth', component: AuthComponent },
    { path: 'unauthorizedUser', component: UnauthorizedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
