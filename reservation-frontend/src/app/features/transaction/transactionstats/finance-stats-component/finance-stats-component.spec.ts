import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceStatsComponent } from './finance-stats-component';

describe('FinanceStatsComponent', () => {
  let component: FinanceStatsComponent;
  let fixture: ComponentFixture<FinanceStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceStatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
