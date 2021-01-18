import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { AlertService, UserService } from '../../_services';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css', '../../_content/update-page.css']
})
export class UserUpdateComponent implements OnInit {
  updateForm: FormGroup;
  loading = false;
  submitted = false;
  userId: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // Initialize Form Validation
    this.updateForm = this.formBuilder.group({
      username: [{value: '', disabled: true}],
      displayName: ['', Validators.required],
      mobileNo: ['']
    });

    // Get user id
    this.userId = parseInt(this.activatedRoute.snapshot.params.id, 10);
    // user id not passed
    if (!this.userId || isNaN(this.userId)) {
      // Redirect to listing
      this.router.navigate(['/user']);
      return;
    }

    // Get user details
    this.getUserDetails();
  }

  // convenience getter for easy access to form fields
  get f() { return this.updateForm.controls; }

  // Get user details from user id
  getUserDetails() {
    this.loading = true;
    this.userService.getUserDetails(this.userId)
      .subscribe(
        (data: any) => {
          this.loading = false;

          // set form values
          this.updateForm.setValue({
            username: data.username,
            displayName: data.displayName,
            mobileNo: data.mobileNo
          });
        },
        error => {
          this.loading = false;

          // Show alert
          this.alertService.error(error);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

          // Redirect to listing
          this.router.navigate(['/user']);
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
    // Delete username
    delete formData.username;
    // Add user id
    formData.userId = this.userId;

    this.loading = true;
    this.userService.update(formData)
      .subscribe(
        (data: any) => {
          this.loading = false;

          // Show alert
          this.alertService.success(data.message, true);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

          // Redirect to listing
          this.router.navigate(['/user']);
        },
        error => {
          this.loading = false;

          // Show alert
          this.alertService.error(error);
          setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert
        });
  }

}
