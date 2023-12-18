import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLeaveApprovalMobile } from './site-leave-approval.mobile';

describe('SiteLeaveApprovalMobile', () => {
  let component: SiteLeaveApprovalMobile;
  let fixture: ComponentFixture<SiteLeaveApprovalMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteLeaveApprovalMobile]
    });
    fixture = TestBed.createComponent(SiteLeaveApprovalMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
