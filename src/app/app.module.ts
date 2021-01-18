import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatExpansionModule } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertComponent } from './_alert';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserListingComponent } from './user/user-listing/user-listing.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserUpdateComponent } from './user/user-update/user-update.component';
import { BookListingComponent } from './book/book-listing/book-listing.component';
import { BookCreateComponent } from './book/book-create/book-create.component';
import { BookUpdateComponent } from './book/book-update/book-update.component';

// Datepicker formats
export const DATEPICKER_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    ConfirmDialogComponent,
    UserListingComponent,
    UserCreateComponent,
    UserUpdateComponent,
    BookListingComponent,
    BookCreateComponent,
    BookUpdateComponent
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
