import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestComponent } from './site-file-ingest.component';

describe('SiteFileIngestComponent', () => {
  let component: SiteFileIngestComponent;
  let fixture: ComponentFixture<SiteFileIngestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
