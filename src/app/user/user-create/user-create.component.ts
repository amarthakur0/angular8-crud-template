import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

import { AlertService, UserService } from '../../_services';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css', '../../_content/create-page.css']
})
export class UserCreateComponent implements OnInit {
  createForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      username: ['', Validators.required],
      displayName: ['', Validators.required],
      emailId: ['', Validators.required],
      mobileNo: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
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

    // Check if password & confirm password is same
    if (formData.password !== formData.confirmPassword) {
      // Show alert
      this.alertService.error('Password & Confirm Password does not match');
      setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert
      return;
    }

    // Delete confirm password
    delete formData.confirmPassword;

    this.loading = true;
    this.userService.create(formData)
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
