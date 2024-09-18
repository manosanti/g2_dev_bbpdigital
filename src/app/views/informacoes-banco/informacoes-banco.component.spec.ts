import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacoesBancoComponent } from './informacoes-banco.component';

describe('InformacoesBancoComponent', () => {
  let component: InformacoesBancoComponent;
  let fixture: ComponentFixture<InformacoesBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacoesBancoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacoesBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
