import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeRatePage } from './change-rate.page';

describe('ChangeRatePage', () => {
  let component: ChangeRatePage;
  let fixture: ComponentFixture<ChangeRatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
