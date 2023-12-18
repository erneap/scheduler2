import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLeaveApprovalComponent } from './site-leave-approval.component';

describe('SiteLeaveApprovalComponent', () => {
  let component: SiteLeaveApprovalComponent;
  let fixture: ComponentFixture<SiteLeaveApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteLeaveApprovalComponent]
    });
    fixture = TestBed.createComponent(SiteLeaveApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
