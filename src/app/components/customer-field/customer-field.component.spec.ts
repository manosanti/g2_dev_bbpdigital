import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFieldComponent } from './customer-field.component';

describe('CustomerFieldComponent', () => {
  let component: CustomerFieldComponent;
  let fixture: ComponentFixture<CustomerFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
