import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import {
  TWELVE_HOUR_LIMIT,
  TWELVE_HOURS_ARRAY_FORMATTED,
  TWENTY_FOUR_HOURS_ARRAY,
  MINUTE_ARRAY,
  MERIDIEM_ENUM,
  MERIDIEM_ARRAY,
  getSelectedMeridiem,
  getValue,
  getTwentyFourHourRepresentation,
  MERIDIEM_TYPE,
} from './ios-timepicker.constants';
import { TIME_FORMAT_ENUM } from './../../../modules/flows/flow-creation/flow-design/flow-action-settings/all-action-settings/action-timepicker-data.constants';
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
  @Output('onChange') timeChangeEmitter = new EventEmitter<Date>(true);

  public HOURS_ARRAY: number[];
  public MERIDIEM_ARRAY = MERIDIEM_ARRAY;
  public MIN_ARRAY_STATE: Array<number>;
  public meridiem: MERIDIEM_TYPE;
  public TIME_FORMAT_ENUM = TIME_FORMAT_ENUM;
  public TWELVE_HOUR_LIMIT = TWELVE_HOUR_LIMIT;
  public DEFAULT_TO_STRATEGY = DEFAULT_SETTING_ENUM;

  constructor() {}

  ngOnInit() {
    this.meridiem = getSelectedMeridiem(this.selectedDate) as MERIDIEM_TYPE;
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      this.HOURS_ARRAY = TWELVE_HOURS_ARRAY_FORMATTED;
    } else if (this.timeFormat === TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT) {
      this.HOURS_ARRAY = TWENTY_FOUR_HOURS_ARRAY;
    }
    if (!this.intervalStep) {
      this.MIN_ARRAY_STATE = MINUTE_ARRAY;
    } else {
      this.MIN_ARRAY_STATE = MINUTE_ARRAY.filter((value) => value % this.intervalStep === 0);
    }
  }

  public onHourChange(changedHourIndex: number) {
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      if (this.meridiem === MERIDIEM_ENUM.PM && TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex] !== TWELVE_HOUR_LIMIT) {
        this.updateDate(
          this.selectedDate.setHours(getTwentyFourHourRepresentation(TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex])),
        );
      } else if (
        this.meridiem === MERIDIEM_ENUM.AM &&
        TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex] === TWELVE_HOUR_LIMIT
      ) {
        this.updateDate(this.selectedDate.setHours(0));
      } else {
        this.updateDate(this.selectedDate.setHours(TWELVE_HOURS_ARRAY_FORMATTED[changedHourIndex]));
      }
    } else if (this.timeFormat === TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT) {
      this.updateDate(this.selectedDate.setHours(TWENTY_FOUR_HOURS_ARRAY[changedHourIndex]));
    }
  }

  private correctTimeOnMeridiemChange() {
    if (this.meridiem == MERIDIEM_ENUM.AM && this.selectedDate.getHours() >= TWELVE_HOUR_LIMIT) {
      this.updateDate(this.selectedDate.setHours(this.selectedDate.getHours() - TWELVE_HOUR_LIMIT));
    } else if (this.meridiem == MERIDIEM_ENUM.PM && this.selectedDate.getHours() < TWELVE_HOUR_LIMIT) {
      this.updateDate(this.selectedDate.setHours(this.selectedDate.getHours() + TWELVE_HOUR_LIMIT));
    }
  }

  private updateDate(timestamp: number) {
    this.timeChangeEmitter.emit(new Date(timestamp));
  }

  public onMinuteChange(changedMinuteIndex: number) {
    this.updateDate(this.selectedDate.setMinutes(this.MIN_ARRAY_STATE[changedMinuteIndex]));
  }

  public onMeridiemChange(changedMeridiemIndex: number) {
    this.meridiem = MERIDIEM_ARRAY[changedMeridiemIndex] as MERIDIEM_TYPE;
    this.correctTimeOnMeridiemChange();
  }

  public getIndexOfSelectedHour() {
    if (this.timeFormat === TIME_FORMAT_ENUM.TWELVE_HOUR_FORMAT) {
      return TWELVE_HOURS_ARRAY_FORMATTED.indexOf(getValue(this.selectedDate.getHours(), TWELVE_HOUR_LIMIT));
    } else if (this.timeFormat === TIME_FORMAT_ENUM.TWENTY_FOUR_HOUR_FORMAT) {
      return TWENTY_FOUR_HOURS_ARRAY.indexOf(this.selectedDate.getHours());
    }
  }
}
