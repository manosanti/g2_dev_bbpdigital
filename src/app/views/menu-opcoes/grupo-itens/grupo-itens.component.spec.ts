import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoItensComponent } from './grupo-itens.component';

describe('GrupoItensComponent', () => {
  let component: GrupoItensComponent;
  let fixture: ComponentFixture<GrupoItensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoItensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoItensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
