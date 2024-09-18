import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigInicialDocumentoComponent } from './config-inicial-documento.component';

describe('ConfigInicialDocumentoComponent', () => {
  let component: ConfigInicialDocumentoComponent;
  let fixture: ComponentFixture<ConfigInicialDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigInicialDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigInicialDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
