import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSchedulePeriodComponent } from './site-schedule-period.component';

describe('SiteSchedulePeriodComponent', () => {
  let component: SiteSchedulePeriodComponent;
  let fixture: ComponentFixture<SiteSchedulePeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteSchedulePeriodComponent]
    });
    fixture = TestBed.createComponent(SiteSchedulePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
