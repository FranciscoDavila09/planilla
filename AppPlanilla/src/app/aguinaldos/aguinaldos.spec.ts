import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aguinaldos } from './aguinaldos';

describe('Aguinaldos', () => {
  let component: Aguinaldos;
  let fixture: ComponentFixture<Aguinaldos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aguinaldos],
    }).compileComponents();

    fixture = TestBed.createComponent(Aguinaldos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
