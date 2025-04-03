import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaDashboardPage } from './qa-dashboard.page';

describe('QaDashboardPage', () => {
  let component: QaDashboardPage;
  let fixture: ComponentFixture<QaDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QaDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
