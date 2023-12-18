import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSiteLeaveListComponent } from './reports-site-leave-list.component';

describe('ReportsSiteLeaveListComponent', () => {
  let component: ReportsSiteLeaveListComponent;
  let fixture: ComponentFixture<ReportsSiteLeaveListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSiteLeaveListComponent]
    });
    fixture = TestBed.createComponent(ReportsSiteLeaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
