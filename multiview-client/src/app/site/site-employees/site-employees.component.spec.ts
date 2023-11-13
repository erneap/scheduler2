import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeesComponent } from './site-employees.component';

describe('SiteEmployeesComponent', () => {
  let component: SiteEmployeesComponent;
  let fixture: ComponentFixture<SiteEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeesComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
