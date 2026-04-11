import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vacciones } from './vacaciones';

describe('Vacciones', () => {
  let component: Vacciones;
  let fixture: ComponentFixture<Vacciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vacciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Vacciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
