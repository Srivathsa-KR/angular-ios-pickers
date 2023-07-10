import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IosDatepickerComponent } from './ios-datepicker.component';

describe('IosDatepickerComponent', () => {
  let component: IosDatepickerComponent;
  let fixture: ComponentFixture<IosDatepickerComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [IosDatepickerComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IosDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
