import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoveragePeriodComponent } from './site-coverage-period.component';

describe('SiteCoveragePeriodComponent', () => {
  let component: SiteCoveragePeriodComponent;
  let fixture: ComponentFixture<SiteCoveragePeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoveragePeriodComponent]
    });
    fixture = TestBed.createComponent(SiteCoveragePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
