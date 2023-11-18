import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorBasicComponent } from './site-editor-basic.component';

describe('SiteEditorBasicComponent', () => {
  let component: SiteEditorBasicComponent;
  let fixture: ComponentFixture<SiteEditorBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorBasicComponent]
    });
    fixture = TestBed.createComponent(SiteEditorBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
