import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeAssignmentEditComponent } from './site-employee-assignment-edit.component';

describe('SiteEmployeeAssignmentEditComponent', () => {
  let component: SiteEmployeeAssignmentEditComponent;
  let fixture: ComponentFixture<SiteEmployeeAssignmentEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeAssignmentEditComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeAssignmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
