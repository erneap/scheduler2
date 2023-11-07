import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordExpireDialogComponent } from './password-expire-dialog.component';

describe('PasswordExpireDialogComponent', () => {
  let component: PasswordExpireDialogComponent;
  let fixture: ComponentFixture<PasswordExpireDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordExpireDialogComponent]
    });
    fixture = TestBed.createComponent(PasswordExpireDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
