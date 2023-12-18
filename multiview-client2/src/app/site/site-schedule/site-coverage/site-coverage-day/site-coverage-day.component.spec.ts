import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageDayComponent } from './site-coverage-day.component';

describe('SiteCoverageDayComponent', () => {
  let component: SiteCoverageDayComponent;
  let fixture: ComponentFixture<SiteCoverageDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageDayComponent]
    });
    fixture = TestBed.createComponent(SiteCoverageDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
