import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEmployeeContactsMobile } from './query-employee-contacts.mobile';

describe('QueryEmployeeContactsMobile', () => {
  let component: QueryEmployeeContactsMobile;
  let fixture: ComponentFixture<QueryEmployeeContactsMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryEmployeeContactsMobile]
    });
    fixture = TestBed.createComponent(QueryEmployeeContactsMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
