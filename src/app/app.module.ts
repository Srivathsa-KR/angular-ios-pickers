import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IosDatepickerComponent } from './components/ios-datepicker/ios-datepicker.component';
import { IosWheelpickerComponent } from './components/ios-wheelpicker/ios-wheelpicker.component';
import { IosTimepickerComponent } from './components/ios-timepicker/ios-timepicker.component';

@NgModule({
  declarations: [
    AppComponent,
    IosDatepickerComponent,
    IosTimepickerComponent,
    IosWheelpickerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
