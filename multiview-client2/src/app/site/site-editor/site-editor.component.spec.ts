import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorComponent } from './site-editor.component';

describe('SiteEditorComponent', () => {
  let component: SiteEditorComponent;
  let fixture: ComponentFixture<SiteEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorComponent]
    });
    fixture = TestBed.createComponent(SiteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
