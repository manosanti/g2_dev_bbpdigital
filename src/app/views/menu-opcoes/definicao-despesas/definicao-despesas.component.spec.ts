import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinicaoDespesasComponent } from './definicao-despesas.component';

describe('DefinicaoDespesasComponent', () => {
  let component: DefinicaoDespesasComponent;
  let fixture: ComponentFixture<DefinicaoDespesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefinicaoDespesasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefinicaoDespesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
