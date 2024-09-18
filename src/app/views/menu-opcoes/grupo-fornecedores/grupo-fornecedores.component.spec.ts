import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoFornecedoresComponent } from './grupo-fornecedores.component';

describe('GrupoFornecedoresComponent', () => {
  let component: GrupoFornecedoresComponent;
  let fixture: ComponentFixture<GrupoFornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoFornecedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
