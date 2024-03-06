import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryMobile } from './query.mobile';

describe('QueryMobile', () => {
  let component: QueryMobile;
  let fixture: ComponentFixture<QueryMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryMobile]
    });
    fixture = TestBed.createComponent(QueryMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
