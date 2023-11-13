import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeAssignmentComponent } from './site-employee-assignment.component';

describe('SiteEmployeeAssignmentComponent', () => {
  let component: SiteEmployeeAssignmentComponent;
  let fixture: ComponentFixture<SiteEmployeeAssignmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeAssignmentComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
