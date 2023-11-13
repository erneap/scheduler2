import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionConfirmationComponent } from './deletion-confirmation.component';

describe('DeletionConfirmationComponent', () => {
  let component: DeletionConfirmationComponent;
  let fixture: ComponentFixture<DeletionConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletionConfirmationComponent]
    });
    fixture = TestBed.createComponent(DeletionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
