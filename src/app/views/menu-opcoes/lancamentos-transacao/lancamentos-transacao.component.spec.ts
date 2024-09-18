import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentosTransacaoComponent } from './lancamentos-transacao.component';

describe('LancamentosTransacaoComponent', () => {
  let component: LancamentosTransacaoComponent;
  let fixture: ComponentFixture<LancamentosTransacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LancamentosTransacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LancamentosTransacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
