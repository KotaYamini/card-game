import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingGameComponent } from './matching-game.component';

describe('MatchingGameComponent', () => {
  let component: MatchingGameComponent;
  let fixture: ComponentFixture<MatchingGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchingGameComponent]
    });
    fixture = TestBed.createComponent(MatchingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
