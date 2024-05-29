import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthorizedMenuComponent } from './not-authorized-menu.component';

describe('NotAuthorizedMenuComponent', () => {
  let component: NotAuthorizedMenuComponent;
  let fixture: ComponentFixture<NotAuthorizedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotAuthorizedMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAuthorizedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
