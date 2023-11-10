import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesMobile } from './employee-notices.mobile';

describe('EmployeeNoticesMobile', () => {
  let component: EmployeeNoticesMobile;
  let fixture: ComponentFixture<EmployeeNoticesMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesMobile]
    });
    fixture = TestBed.createComponent(EmployeeNoticesMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
