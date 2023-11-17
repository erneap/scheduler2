import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeVariationsComponent } from './site-employee-variations.component';

describe('SiteEmployeeVariationsComponent', () => {
  let component: SiteEmployeeVariationsComponent;
  let fixture: ComponentFixture<SiteEmployeeVariationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeVariationsComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
