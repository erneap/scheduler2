import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleComponent } from './site-schedule.component';

describe('SiteScheduleComponent', () => {
  let component: SiteScheduleComponent;
  let fixture: ComponentFixture<SiteScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleComponent]
    });
    fixture = TestBed.createComponent(SiteScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
