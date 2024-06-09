import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResponsesMapComponent } from './view-responses-map.component';

describe('ViewResponsesMapComponent', () => {
  let component: ViewResponsesMapComponent;
  let fixture: ComponentFixture<ViewResponsesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewResponsesMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewResponsesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
