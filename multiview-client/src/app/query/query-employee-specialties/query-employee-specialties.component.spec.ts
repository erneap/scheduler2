import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEmployeeSpecialtiesComponent } from './query-employee-specialties.component';

describe('QueryEmployeeSpecialtiesComponent', () => {
  let component: QueryEmployeeSpecialtiesComponent;
  let fixture: ComponentFixture<QueryEmployeeSpecialtiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryEmployeeSpecialtiesComponent]
    });
    fixture = TestBed.createComponent(QueryEmployeeSpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
