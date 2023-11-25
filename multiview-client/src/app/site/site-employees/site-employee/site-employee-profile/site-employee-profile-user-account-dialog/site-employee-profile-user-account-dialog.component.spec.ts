import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeProfileUserAccountDialogComponent } from './site-employee-profile-user-account-dialog.component';

describe('SiteEmployeeProfileUserAccountDialogComponent', () => {
  let component: SiteEmployeeProfileUserAccountDialogComponent;
  let fixture: ComponentFixture<SiteEmployeeProfileUserAccountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeProfileUserAccountDialogComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeProfileUserAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
