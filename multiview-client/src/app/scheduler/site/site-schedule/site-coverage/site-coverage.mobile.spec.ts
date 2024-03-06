import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageMobile } from './site-coverage.mobile';

describe('SiteCoverageMobile', () => {
  let component: SiteCoverageMobile;
  let fixture: ComponentFixture<SiteCoverageMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageMobile]
    });
    fixture = TestBed.createComponent(SiteCoverageMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
