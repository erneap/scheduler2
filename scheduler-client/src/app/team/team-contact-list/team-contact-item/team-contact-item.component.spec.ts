import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamContactItemComponent } from './team-contact-item.component';

describe('TeamContactItemComponent', () => {
  let component: TeamContactItemComponent;
  let fixture: ComponentFixture<TeamContactItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamContactItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamContactItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
