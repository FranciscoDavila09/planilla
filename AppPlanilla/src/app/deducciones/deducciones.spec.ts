import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deducciones } from './deducciones';

describe('Deducciones', () => {
  let component: Deducciones;
  let fixture: ComponentFixture<Deducciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deducciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Deducciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
