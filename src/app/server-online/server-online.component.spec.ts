import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerOnlineComponent } from './server-online.component';

describe('ServerOnlineComponent', () => {
  let component: ServerOnlineComponent;
  let fixture: ComponentFixture<ServerOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
