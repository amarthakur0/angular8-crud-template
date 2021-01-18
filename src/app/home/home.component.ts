import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../_models';
import { UserService, AuthenticationService, AlertService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    // Get user details
    this.getUserDetails();
  }

  // Get user details from user id
  private getUserDetails() {
    this.loading = true;
    this.userService.getUserDetails(this.currentUser.userId)
      .subscribe(
        (data: any) => {
          this.loading = false;
        },
        error => {
          this.loading = false;
          // Redirect to listing
          this.router.navigate(['/login']);
        });
  }
}
