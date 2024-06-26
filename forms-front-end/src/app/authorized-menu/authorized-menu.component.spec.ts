import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizedMenuComponent } from './authorized-menu.component';

describe('AuthorizedMenuComponent', () => {
  let component: AuthorizedMenuComponent;
  let fixture: ComponentFixture<AuthorizedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizedMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
