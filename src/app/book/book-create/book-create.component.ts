import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';

import { AlertService, BookService } from '../../_services';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css', '../../_content/create-page.css']
})
export class BookCreateComponent implements OnInit {
  createForm: FormGroup;
  loading = false;
  submitted = false;
  // For Dates
  todayDate = new Date();
  momentYmdDateFormat = 'YYYY-MM-DD';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private bookService: BookService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      isbnNumber: ['', Validators.required],
      bookName: ['', Validators.required],
      bookSummary: [''],
      bookAuthor: [''],
      publication: [''],
      publishDate: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

  // On form submit
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.createForm.invalid) {
      return;
    }

    // Post form data
    const formData = this.createForm.value;
    // Change Publish Date
    formData.publishDate = moment(formData.publishDate).format(this.momentYmdDateFormat);

    this.loading = true;
    this.bookService.create(formData)
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
