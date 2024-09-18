import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassword03Component } from './forgot-password-03.component';

describe('ForgotPassword03Component', () => {
  let component: ForgotPassword03Component;
  let fixture: ComponentFixture<ForgotPassword03Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassword03Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassword03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
