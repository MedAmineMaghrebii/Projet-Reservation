import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelComponenet } from './personnel-componenet';

describe('PersonnelComponenet', () => {
  let component: PersonnelComponenet;
  let fixture: ComponentFixture<PersonnelComponenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnelComponenet],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonnelComponenet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
