import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorWorkcentersComponent } from './site-editor-workcenters.component';

describe('SiteEditorWorkcentersComponent', () => {
  let component: SiteEditorWorkcentersComponent;
  let fixture: ComponentFixture<SiteEditorWorkcentersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorWorkcentersComponent]
    });
    fixture = TestBed.createComponent(SiteEditorWorkcentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
