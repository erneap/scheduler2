import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeLeaveEditorComponent } from './site-employee-leave-editor.component';

describe('SiteEmployeeLeaveEditorComponent', () => {
  let component: SiteEmployeeLeaveEditorComponent;
  let fixture: ComponentFixture<SiteEmployeeLeaveEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeLeaveEditorComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeLeaveEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
