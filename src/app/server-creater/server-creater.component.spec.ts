import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerCreaterComponent } from './server-creater.component';

describe('ServerCreaterComponent', () => {
  let component: ServerCreaterComponent;
  let fixture: ComponentFixture<ServerCreaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerCreaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerCreaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
