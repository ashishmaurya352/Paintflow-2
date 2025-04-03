import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequisitionPage } from './requisition.page';

describe('RequisitionPage', () => {
  let component: RequisitionPage;
  let fixture: ComponentFixture<RequisitionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
