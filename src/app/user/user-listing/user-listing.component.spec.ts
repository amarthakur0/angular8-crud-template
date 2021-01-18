import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListingComponent } from './user-listing.component';

describe('UserListingComponent', () => {
  let component: UserListingComponent;
  let fixture: ComponentFixture<UserListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
