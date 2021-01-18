import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
  userDisplayName = '';
  isNavbarCollapsed = false;
  isUserDropdownOpen = false;
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (this.currentUser) {
        this.userDisplayName = this.currentUser.displayName;
      }
    });
  }

  logout() {
    this.isUserDropdownOpen = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
