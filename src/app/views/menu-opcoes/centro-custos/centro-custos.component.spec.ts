import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroCustosComponent } from './centro-custos.component';

describe('CentroCustosComponent', () => {
  let component: CentroCustosComponent;
  let fixture: ComponentFixture<CentroCustosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroCustosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroCustosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
