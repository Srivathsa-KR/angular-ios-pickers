import { Component } from '@angular/core';
import { ALLOWED_DATES_ENUM } from './components/ios-datepicker/ios-datepicker.constants';
import { TIME_FORMAT_ENUM } from './components/ios-timepicker/ios-timepicker.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFutureDate = new Date();
  selectedPastDate = new Date();
  dateFor12HourTime = new Date();
  dateFor24HourTime = new Date();

  readonly ALLOWED_DATES = ALLOWED_DATES_ENUM;
  readonly TIME_FORMAT = TIME_FORMAT_ENUM;
}
