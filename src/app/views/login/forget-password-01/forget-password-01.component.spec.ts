import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPassword01Component } from './forget-password-01.component';

describe('ForgetPassword01Component', () => {
  let component: ForgetPassword01Component;
  let fixture: ComponentFixture<ForgetPassword01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPassword01Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPassword01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
