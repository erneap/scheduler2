import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataPurgeToolComponent } from './admin-data-purge-tool.component';

describe('AdminDataPurgeToolComponent', () => {
  let component: AdminDataPurgeToolComponent;
  let fixture: ComponentFixture<AdminDataPurgeToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDataPurgeToolComponent]
    });
    fixture = TestBed.createComponent(AdminDataPurgeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
