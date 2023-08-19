import { Component } from '@angular/core';
import { ALLOWED_DATES_ENUM } from './components/ios-datepicker/ios-datepicker.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedFutureDate = new Date();
  selectedPastDate = new Date()

  readonly ALLOWED_DATES = ALLOWED_DATES_ENUM;
}
