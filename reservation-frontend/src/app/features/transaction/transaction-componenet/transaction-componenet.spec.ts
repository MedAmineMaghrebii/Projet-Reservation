import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionComponenet } from './transaction-componenet';

describe('TransactionComponenet', () => {
  let component: TransactionComponenet;
  let fixture: ComponentFixture<TransactionComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponenet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
