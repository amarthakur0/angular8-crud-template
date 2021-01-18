import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

import { AlertService, BookService } from '../../_services';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-book-update',
  templateUrl: './book-update.component.html',
  styleUrls: ['./book-update.component.css', '../../_content/update-page.css']
})
export class BookUpdateComponent implements OnInit {
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  bookId: number;
  // For Dates
  todayDate = new Date();
  momentYmdDateFormat = 'YYYY-MM-DD';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookService: BookService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // Initialize Form Validation
    this.updateForm = this.formBuilder.group({
      isbnNumber: [{value: '', disabled: true}],
      bookName: ['', Validators.required],
      bookSummary: [''],
      bookAuthor: [''],
      publication: [''],
      publishDate: ['', Validators.required]
    });

    // Get book id
    this.bookId = parseInt(this.activatedRoute.snapshot.params.id, 10);
    // book id not passed
    if (!this.bookId || isNaN(this.bookId)) {
      // Redirect to listing
      this.router.navigate(['/book']);
      return;
    }

    // Get book details
    this.getBookDetails();
  }

  // convenience getter for easy access to form fields
  get f() { return this.updateForm.controls; }

  // Get book details from book id
  getBookDetails() {
    this.loading = true;
    this.bookService.getBookDetails(this.bookId)
      .subscribe(
        (data: any) => {
          this.loading = false;

          // set form values
          this.updateForm.setValue({
            isbnNumber: data.isbnNumber,
            bookName: data.bookName,
            bookSummary: data.bookSummary,
            bookAuthor: data.bookAuthor,
            publication: data.publication,
            publishDate: data.publishDate
          });
        },
        error => {
          this.loading = false;

          // Show alert
          this.alertService.error(error);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

          // Redirect to listing
          this.router.navigate(['/book']);
        });
  }

  // On form submit
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }

    // Post form data
    const formData = this.updateForm.value;
    // Delete isbnNumber
    delete formData.isbnNumber;
    // Add book id
    formData.bookId = this.bookId;
    // Change Publish Date
    formData.publishDate = moment(formData.publishDate).format(this.momentYmdDateFormat);

    this.loading = true;
    this.bookService.update(formData)
      .subscribe(
        (data: any) => {
          this.loading = false;

          // Show alert
          this.alertService.success(data.message, true);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

          // Redirect to listing
          this.router.navigate(['/book']);
        },
        error => {
          this.loading = false;

          // Show alert
          this.alertService.error(error);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert
        });
  }

}
