import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeVariationComponent } from './site-employee-variation.component';

describe('SiteEmployeeVariationComponent', () => {
  let component: SiteEmployeeVariationComponent;
  let fixture: ComponentFixture<SiteEmployeeVariationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeVariationComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
