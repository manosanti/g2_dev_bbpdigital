import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSapComponent } from './usuarios-sap.component';

describe('UsuariosSapComponent', () => {
  let component: UsuariosSapComponent;
  let fixture: ComponentFixture<UsuariosSapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosSapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
