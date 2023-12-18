import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEmployeeLeaveEditorRowComponent } from './site-employee-leave-editor-row.component';

describe('SiteEmployeeLeaveEditorRowComponent', () => {
  let component: SiteEmployeeLeaveEditorRowComponent;
  let fixture: ComponentFixture<SiteEmployeeLeaveEditorRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEmployeeLeaveEditorRowComponent]
    });
    fixture = TestBed.createComponent(SiteEmployeeLeaveEditorRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
