import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignTeamPage } from './assign-team.page';

describe('AssignTeamPage', () => {
  let component: AssignTeamPage;
  let fixture: ComponentFixture<AssignTeamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
