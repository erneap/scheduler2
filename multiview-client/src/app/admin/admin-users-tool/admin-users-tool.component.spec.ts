import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersToolComponent } from './admin-users-tool.component';

describe('AdminUsersToolComponent', () => {
  let component: AdminUsersToolComponent;
  let fixture: ComponentFixture<AdminUsersToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUsersToolComponent]
    });
    fixture = TestBed.createComponent(AdminUsersToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
