import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IosWheelpickerComponent } from './ios-wheelpicker.component';

describe('IosWheelpickerComponent', () => {
  let component: IosWheelpickerComponent;
  let fixture: ComponentFixture<IosWheelpickerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IosWheelpickerComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IosWheelpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
