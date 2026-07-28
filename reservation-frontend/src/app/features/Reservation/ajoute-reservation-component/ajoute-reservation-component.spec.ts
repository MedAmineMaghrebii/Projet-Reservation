import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteReservationComponent } from './ajoute-reservation-component';

describe('AjouteReservationComponent', () => {
  let component: AjouteReservationComponent;
  let fixture: ComponentFixture<AjouteReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouteReservationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AjouteReservationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
