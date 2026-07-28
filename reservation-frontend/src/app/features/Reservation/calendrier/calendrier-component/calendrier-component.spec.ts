import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierComponent } from './calendrier-component';

describe('CalendrierComponent', () => {
  let component: CalendrierComponent;
  let fixture: ComponentFixture<CalendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendrierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendrierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
