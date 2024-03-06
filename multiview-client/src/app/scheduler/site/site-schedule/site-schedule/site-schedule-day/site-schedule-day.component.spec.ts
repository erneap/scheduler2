import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleDayComponent } from './site-schedule-day.component';

describe('SiteScheduleDayComponent', () => {
  let component: SiteScheduleDayComponent;
  let fixture: ComponentFixture<SiteScheduleDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleDayComponent]
    });
    fixture = TestBed.createComponent(SiteScheduleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
