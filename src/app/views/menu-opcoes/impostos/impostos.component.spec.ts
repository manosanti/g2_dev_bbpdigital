import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostosComponent } from './impostos.component';

describe('ImpostosComponent', () => {
  let component: ImpostosComponent;
  let fixture: ComponentFixture<ImpostosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
