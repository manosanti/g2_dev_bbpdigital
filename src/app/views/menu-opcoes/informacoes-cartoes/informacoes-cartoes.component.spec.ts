import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesCartoesComponent } from './informacoes-cartoes.component';

describe('InformacoesCartoesComponent', () => {
  let component: InformacoesCartoesComponent;
  let fixture: ComponentFixture<InformacoesCartoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacoesCartoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacoesCartoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
