import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoHolidayBelowDialogComponent } from './pto-holiday-below-dialog.component';

describe('PtoHolidayBelowDialogComponent', () => {
  let component: PtoHolidayBelowDialogComponent;
  let fixture: ComponentFixture<PtoHolidayBelowDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtoHolidayBelowDialogComponent]
    });
    fixture = TestBed.createComponent(PtoHolidayBelowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
