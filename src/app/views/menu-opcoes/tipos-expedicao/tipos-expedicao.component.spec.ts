import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposExpedicaoComponent } from './tipos-expedicao.component';

describe('TiposExpedicaoComponent', () => {
  let component: TiposExpedicaoComponent;
  let fixture: ComponentFixture<TiposExpedicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposExpedicaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposExpedicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
