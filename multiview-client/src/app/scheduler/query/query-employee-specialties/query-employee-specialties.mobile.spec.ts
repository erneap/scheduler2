import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEmployeeSpecialtiesMobile } from './query-employee-specialties.mobile';

describe('QueryEmployeeSpecialtiesMobile', () => {
  let component: QueryEmployeeSpecialtiesMobile;
  let fixture: ComponentFixture<QueryEmployeeSpecialtiesMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryEmployeeSpecialtiesMobile]
    });
    fixture = TestBed.createComponent(QueryEmployeeSpecialtiesMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
