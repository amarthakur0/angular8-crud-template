import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserListingComponent } from './user/user-listing/user-listing.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { BookListingComponent } from './book/book-listing/book-listing.component';
import { BookCreateComponent } from './book/book-create/book-create.component';
import { BookUpdateComponent } from './book/book-update/book-update.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserListingComponent, canActivate: [AuthGuard] },
  { path: 'user-create', component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: 'user-update/:id', component: UserUpdateComponent, canActivate: [AuthGuard] },
  { path: 'book', component: BookListingComponent, canActivate: [AuthGuard] },
  { path: 'book-create', component: BookCreateComponent, canActivate: [AuthGuard] },
  { path: 'book-update/:id', component: BookUpdateComponent, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
