import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { User } from '../../_models';
import { UserService, AlertService } from '../../_services';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

const alertShowTimeout = environment.alertShowTimeout;

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css', '../../_content/listing-page.css']
})
export class UserListingComponent implements OnInit {
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['username', 'displayName', 'emailId', 'mobileNo', 'createdDate', 'action'];
  loading = true;
  listingDateFormat = environment.listingDateFormat;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadAllUsers();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Load all users
  private loadAllUsers() {
    this.userService.getAll()
      .pipe(first())
      .subscribe(
        (users: any) => {
          this.dataSource = new MatTableDataSource(users);
          this.loading = false;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          this.loading = false;
        });
  }

  // Delete User
  deleteUser(inputData: any) {
    const { displayName, userId } = inputData;

    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: `Are you sure, you want to delete User: ${displayName}`
      }
    });

    // On dialog close action
    confirmDialog.afterClosed().subscribe(result => {
      // On confirmation
      if (result === true) {
        // Delete now
        this.loading = true;
        this.userService.delete(userId)
          .subscribe(
            (data: any) => {
              this.loading = false;

              // Show alert
              this.alertService.success(data.message, true);
              setTimeout(() => this.alertService.clear(), alertShowTimeout); // hide alert

              // Remove user from datasource
              const index = this.dataSource.data.findIndex((elem) => elem.userId === userId);
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
