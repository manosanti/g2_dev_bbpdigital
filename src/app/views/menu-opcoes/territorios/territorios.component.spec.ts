import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoriosComponent } from './territorios.component';

describe('TerritoriosComponent', () => {
  let component: TerritoriosComponent;
  let fixture: ComponentFixture<TerritoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerritoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerritoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
