import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageComponent } from './site-coverage.component';

describe('SiteCoverageComponent', () => {
  let component: SiteCoverageComponent;
  let fixture: ComponentFixture<SiteCoverageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageComponent]
    });
    fixture = TestBed.createComponent(SiteCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
