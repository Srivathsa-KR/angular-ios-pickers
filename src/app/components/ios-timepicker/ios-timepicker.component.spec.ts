import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IosTimepickerComponent } from './ios-timepicker.component';

describe('IosTimepickerComponent', () => {
  let component: IosTimepickerComponent;
  let fixture: ComponentFixture<IosTimepickerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IosTimepickerComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IosTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
