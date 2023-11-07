import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitDialogComponent } from './wait-dialog.component';

describe('WaitDialogComponent', () => {
  let component: WaitDialogComponent;
  let fixture: ComponentFixture<WaitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WaitDialogComponent]
    });
    fixture = TestBed.createComponent(WaitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
