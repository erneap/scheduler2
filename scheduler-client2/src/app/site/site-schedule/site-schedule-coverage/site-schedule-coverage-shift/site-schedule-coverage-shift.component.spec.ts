import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleCoverageShiftComponent } from './site-schedule-coverage-shift.component';

describe('SiteScheduleCoverageShiftComponent', () => {
  let component: SiteScheduleCoverageShiftComponent;
  let fixture: ComponentFixture<SiteScheduleCoverageShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteScheduleCoverageShiftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteScheduleCoverageShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
