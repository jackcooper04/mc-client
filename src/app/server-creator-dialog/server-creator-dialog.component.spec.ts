import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerCreatorDialogComponent } from './server-creator-dialog.component';

describe('ServerCreatorDialogComponent', () => {
  let component: ServerCreatorDialogComponent;
  let fixture: ComponentFixture<ServerCreatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerCreatorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerCreatorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
