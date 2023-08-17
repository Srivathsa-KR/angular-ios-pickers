import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import {
  ALLOWED_DATES_ENUM,
  ALLOWED_DATES,
} from './ios-datepicker.constants';
import {  DEFAULT_SETTING_ENUM } from '../ios-wheelpicker/ios-wheelpicker.component';

import { MONTHS, YEARS } from './ios-datepicker.constants';
import { getListOfAllDates, getMaxDaysInMonth, getMinimum } from '../utils/utils';

@Component({
  selector: 'app-ios-datepicker',
  templateUrl: './ios-datepicker.component.html',
  styleUrls: ['./ios-datepicker.component.scss'],
})
export class IosDatepickerComponent implements OnInit, OnChanges {
  @Input('date') selectedDate: Date;
  @Output('dateChange') dateChangeEmitter = new EventEmitter<Date>();

  @Input('allowedDates') allowedDates: ALLOWED_DATES | string;
  // @Output('onDateSelected') dateEmitter = new EventEmitter<Date>();

  public daysList: number[] = [];
  public YEAR_LIST = YEARS;
  public MONTH_LIST = MONTHS;
  public DEFAULT_MONTHS = MONTHS; //why is this necessary?
  public defaultSetting: DEFAULT_SETTING_ENUM; //why?
  readonly CURRENT_DATE = new Date();
  constructor() {}

  ngOnInit() {
    /* The selectedDate may or may not be the same as CURRENT_DATE */
    this.initializeYearListBasedOnCurrentDate();
    this.setMonthListUponChange(this.selectedDate);
    this.setDaysListUponChange(this.selectedDate);
  }

  ngOnChanges(change: SimpleChanges) {
    const changedDate: SimpleChange = change.selectedDate;
    const shouldRunChange = changedDate && !changedDate.firstChange; //why? because the initializations are being taken care of in OnInit
    if (shouldRunChange){
      if (changedDate.currentValue.getFullYear() !== changedDate.previousValue.getFullYear()) {
        this.setMonthListUponChange(changedDate.currentValue);
        this.setDaysListUponChange(changedDate.currentValue);
      }
      if (changedDate.currentValue.getMonth() !== changedDate.previousValue.getMonth()) {
        this.setDaysListUponChange(changedDate.currentValue);
      }
    }
  }

  onDayChange(changedDayIndex: number) {
    this.emitNewlySelectedDate(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.daysList[changedDayIndex],
    );
  }

  onMonthChange(changedMonthIndex: number) {
    const monthToBeSet = MONTHS.indexOf(this.MONTH_LIST[changedMonthIndex]);
    const dayToBeSet = this.getDayToBeSet(this.selectedDate.getFullYear(), monthToBeSet);
    this.emitNewlySelectedDate(this.selectedDate.getFullYear(), monthToBeSet, dayToBeSet);
  }

  onYearChange(changedYearIndex: number) { //what happens if nothing gets emitted?
    const yearToBeSet = this.YEAR_LIST[changedYearIndex];
    const dayToBeSet = this.getDayToBeSet(yearToBeSet, this.selectedDate.getMonth());
    this.emitNewlySelectedDate(yearToBeSet, this.selectedDate.getMonth(), dayToBeSet);
  }

  private setDaysListUponChange(concerenedDate: Date) {
    const allDatesList = getListOfAllDates(concerenedDate.getFullYear(), concerenedDate.getMonth());
    if (
      concerenedDate.getFullYear() === this.CURRENT_DATE.getFullYear() &&
      concerenedDate.getMonth() === this.CURRENT_DATE.getMonth()
    ) {
      if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousDaysList = allDatesList.slice(
          0, allDatesList.indexOf(this.CURRENT_DATE.getDate())
        );
        this.daysList = previousDaysList;
      } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureDaysList = allDatesList.slice(
          allDatesList.indexOf(this.CURRENT_DATE.getDate() + 1),
          allDatesList.length + 1,
        );
        this.daysList = futureDaysList;
      }
    } else {
      this.daysList = allDatesList;
    }
  }

  private setMonthListUponChange(concerenedDate: Date) {
    /* The list of months displayed depends on the year selected. If the year selected corresponds to
       the current date, then specific items should be removed from the months list according to allowed dates.
       Otherwise, all the months can be displayed */
    if (concerenedDate.getFullYear() === this.CURRENT_DATE.getFullYear()) {
      if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
        const previousMonths = MONTHS.slice(0, this.CURRENT_DATE.getMonth() + 1);
        this.MONTH_LIST = previousMonths;
      } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
        const futureMonths = MONTHS.slice(this.CURRENT_DATE.getMonth(), MONTHS.length);
        this.MONTH_LIST = futureMonths;
      }
    } else {
      this.MONTH_LIST = MONTHS;
    }
  }

  private initializeYearListBasedOnCurrentDate() {
    if (this.allowedDates === ALLOWED_DATES_ENUM.PAST_DATES) {
      const pastYearList = YEARS.slice(0, YEARS.indexOf(this.CURRENT_DATE.getFullYear() + 1));
      this.YEAR_LIST = pastYearList;
      this.defaultSetting = DEFAULT_SETTING_ENUM.DEFAULT_TO_END;
    } else if (this.allowedDates === ALLOWED_DATES_ENUM.FUTURE_DATES) {
      const futureYearList = YEARS.slice(YEARS.indexOf(this.CURRENT_DATE.getFullYear()), YEARS.length);
      this.YEAR_LIST = futureYearList;
      this.defaultSetting = DEFAULT_SETTING_ENUM.DEFAULT_TO_START;
    }
  }

  private getDayToBeSet(year: number, month: number): number {
    const maxDaysInMonth = getMaxDaysInMonth(year, month);
    return getMinimum(maxDaysInMonth, this.selectedDate.getDate());
  }

  private emitNewlySelectedDate(year:number, month:number, date: number) {
    const newDate = new Date(year, month, date);
    this.dateChangeEmitter.emit(newDate);
    // this.dateEmitter.emit(newDate);
  }
}
