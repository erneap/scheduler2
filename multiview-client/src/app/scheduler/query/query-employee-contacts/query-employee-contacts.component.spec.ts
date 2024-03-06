import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEmployeeContactsComponent } from './query-employee-contacts.component';

describe('QueryEmployeeContactsComponent', () => {
  let component: QueryEmployeeContactsComponent;
  let fixture: ComponentFixture<QueryEmployeeContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryEmployeeContactsComponent]
    });
    fixture = TestBed.createComponent(QueryEmployeeContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
