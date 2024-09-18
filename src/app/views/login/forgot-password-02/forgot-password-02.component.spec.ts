import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassword02Component } from './forgot-password-02.component';

describe('ForgotPassword02Component', () => {
  let component: ForgotPassword02Component;
  let fixture: ComponentFixture<ForgotPassword02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassword02Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPassword02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
