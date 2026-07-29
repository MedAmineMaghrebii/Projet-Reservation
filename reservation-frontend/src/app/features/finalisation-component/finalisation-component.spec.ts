import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalisationComponent } from './finalisation-component';

describe('FinalisationComponent', () => {
  let component: FinalisationComponent;
  let fixture: ComponentFixture<FinalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalisationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalisationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
