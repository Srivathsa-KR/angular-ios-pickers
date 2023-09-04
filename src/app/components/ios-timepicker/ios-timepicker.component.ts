import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  TWELVE_HOUR_LIMIT,
  TWELVE_HOURS_ARRAY_REARRANGED,
  TWENTY_FOUR_HOURS_ARRAY,
  MINUTE_ARRAY,
  MERIDIEM_ENUM,
  MERIDIEM_ARRAY,
  getSelectedMeridiem,
  getValue,
  getTwentyFourHourRepresentation,
  MERIDIEM_TYPE,
  TIME_FORMAT_ENUM
} from './ios-timepicker.constants';
// import {  } from './../../../modules/flows/flow-creation/flow-design/flow-action-settings/all-action-settings/action-timepicker-data.constants';
import { DEFAULT_SETTING_ENUM } from '../ios-wheelpicker/ios-wheelpicker.component';

@Component({
  selector: 'app-ios-timepicker',
  templateUrl: './ios-timepicker.component.html',
  styleUrls: ['./ios-timepicker.component.scss'],
})
export class IosTimepickerComponent implements OnInit {
  @Input('date') selectedDate: Date;
  @Input('timeFormat') timeFormat: string;
  @Input('intervalStep') intervalStep: number | null;
  @Output('dateChange') timeChangeEmitter = new EventEmitter<Date>(true);

  public HOURS_ARRAY: number[];
  public MERIDIEM_ARRAY = MERIDIEM_ARRAY;
  public MIN_ARRAY_STATE: Array<number>;
  public meridiemOfSelectedDate: MERIDIEM_ENUM;
  readonly TIME_FORMAT_ENUM = TIME_FORMAT_ENUM;
  readonly TWELVE_HOUR_LIMIT = TWELVE_HOUR_LIMIT;
  public DEFAULT_TO_STRATEGY = DEFAULT_SETTING_ENUM;

  constructor() {}

  ngOnInit() {
    this.meridiemOfSelectedDate = getSelectedMeridiem(this.selectedDate);
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      this.HOURS_ARRAY = TWELVE_HOURS_ARRAY_REARRANGED;
    } else {
      this.HOURS_ARRAY = TWENTY_FOUR_HOURS_ARRAY;
    }
    if (this.intervalStep) {
      this.MIN_ARRAY_STATE = MINUTE_ARRAY.filter((value) => value % this.intervalStep === 0);
    } else {
      this.MIN_ARRAY_STATE = MINUTE_ARRAY;
    }
  }

  public onHourChange(changedHourIndex: number) {
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      if (this.meridiemOfSelectedDate === MERIDIEM_ENUM.PM && TWELVE_HOURS_ARRAY_REARRANGED[changedHourIndex] !== TWELVE_HOUR_LIMIT) {
        this.updateDate(
          this.selectedDate.setHours(getTwentyFourHourRepresentation(TWELVE_HOURS_ARRAY_REARRANGED[changedHourIndex]))
        );
      } else if (
        this.meridiemOfSelectedDate === MERIDIEM_ENUM.AM &&
        TWELVE_HOURS_ARRAY_REARRANGED[changedHourIndex] === TWELVE_HOUR_LIMIT
      ) {
        this.updateDate(this.selectedDate.setHours(0));
      } else {
        this.updateDate(this.selectedDate.setHours(TWELVE_HOURS_ARRAY_REARRANGED[changedHourIndex]));
      }
    } else {
      this.updateDate(this.selectedDate.setHours(TWENTY_FOUR_HOURS_ARRAY[changedHourIndex]));
    }
  }

  public onMinuteChange(changedMinuteIndex: number) {
    this.updateDate(this.selectedDate.setMinutes(this.MIN_ARRAY_STATE[changedMinuteIndex]));
  }

  public onMeridiemChange(changedMeridiemIndex: number) {
    this.meridiemOfSelectedDate = MERIDIEM_ARRAY[changedMeridiemIndex];
    //Meridiem has changed from PM to AM
    if (this.meridiemOfSelectedDate == MERIDIEM_ENUM.AM) {
      this.updateDate(this.selectedDate.setHours(this.selectedDate.getHours() - TWELVE_HOUR_LIMIT));
    }
    //Meridiem has changed from AM to PM
    else {
      this.updateDate(this.selectedDate.setHours(this.selectedDate.getHours() + TWELVE_HOUR_LIMIT));
    }
    // this.correctTimeOnMeridiemChange();
  }

  public getIndexOfSelectedHour() {
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      return TWELVE_HOURS_ARRAY_REARRANGED.indexOf(getValue(this.selectedDate.getHours(), TWELVE_HOUR_LIMIT));
    } else {
      return TWENTY_FOUR_HOURS_ARRAY.indexOf(this.selectedDate.getHours());
    }
  }

  private updateDate(timestamp: number) {
    this.timeChangeEmitter.emit(new Date(timestamp));
  }
}
