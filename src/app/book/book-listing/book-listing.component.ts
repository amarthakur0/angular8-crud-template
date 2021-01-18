import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { first, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

import { Book } from '../../_models';
import { BookService, AlertService } from '../../_services';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-book-listing',
  templateUrl: './book-listing.component.html',
  styleUrls: ['./book-listing.component.css', '../../_content/listing-page.css']
})
export class BookListingComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Book>;
  resultsLength = 0;
  displayedColumns: string[] = ['isbnNumber', 'bookName', 'bookAuthor', 'publication',
    'publishDate', 'createdDate', 'action'];
  loading = true;
  listingDateFormat = environment.listingDateFormat;
  listingDateYMD = 'dd-MM-yyyy';
  // Filter controls
  isbnNumber = new FormControl('');
  bookName = new FormControl('');
  // Dates
  todayDate = new Date();
  dateBefore7Days = new Date((new Date()).setDate(this.todayDate.getDate() - 7));
  fromDate = new FormControl(this.dateBefore7Days);
  toDate = new FormControl(this.todayDate);
  momentYmdDateFormat = 'YYYY-MM-DD';
  // For pagination
  pageNum = 1;
  perPage = 10;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private bookService: BookService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // Load books
    this.loadBooks();
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        tap(() => this.onPagination())
      )
      .subscribe();
  }

  // On pagination click
  private onPagination() {
    this.perPage = this.paginator.pageSize;
    this.pageNum = this.paginator.pageIndex + 1;

    // load books now
    this.loadBooks();
  }

  // Search book after click on search button
  search() {
    // validate from & to date
    const fromDateMoment = moment(this.fromDate.value);
    const toDateMoment = moment(this.toDate.value);
    const daysDiff = toDateMoment.diff(fromDateMoment, 'days');
    if (daysDiff < 0) {
      // Show alert
      this.alertService.error('From date should be greater than To date');
      setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert
      return;
    }

    this.loading = true;
    this.loadBooks();
  }

  // Reset filter form
  reset() {
    this.fromDate.setValue(this.dateBefore7Days);
    this.toDate.setValue(this.todayDate);
    this.isbnNumber.setValue('');
    this.bookName.setValue('');

    // call search now
    this.search();
  }

  // Load books from API
  private loadBooks() {
    // Reset data
    this.dataSource = null;
    this.resultsLength = 0;

    // Params required for API
    const fromDateYMD = moment(this.fromDate.value).format(this.momentYmdDateFormat);
    const toDateYMD = moment(this.toDate.value).format(this.momentYmdDateFormat);
    const paramsObj = {
      fromDate: fromDateYMD,
      toDate: toDateYMD,
      isbnNumber: this.isbnNumber.value,
      bookName: this.bookName.value,
      pageNum: this.pageNum,
      perPage: this.perPage
    };

    this.bookService.getBooksForListing(paramsObj)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.dataSource = new MatTableDataSource(data.book);
          this.resultsLength = data.count;
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
  }

  // Delete book
  deleteBook(inputData: any) {
    const { bookId } = inputData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Book',
        message: `Are you sure, you want to delete this Book`
      }
    });

    // On dialog close action
    confirmDialog.afterClosed().subscribe(result => {
      // On confirmation
      if (result === true) {
        // Delete now
        this.loading = true;
        this.bookService.delete(bookId)
          .subscribe(
            (data: any) => {
              this.loading = false;

              // Show alert
              this.alertService.success(data.message, true);
              setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

              // Remove book from datasource
              const index = this.dataSource.data.findIndex((elem) => elem.bookId === bookId);
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription(); // Refresh the datasource
            },
            error => {
              this.loading = false;

              // Show alert
              this.alertService.error(error);
              setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert
            });
      }
    });
  }
}
