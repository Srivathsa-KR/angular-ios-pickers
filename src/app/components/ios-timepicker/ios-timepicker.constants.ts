const arrayFillCB = (initial : number, index : number) => initial + index;

export const TWELVE_HOUR_LIMIT = 12;

export enum MERIDIEM_ENUM {
  AM = 'AM',
  PM = 'PM',
};
export type MERIDIEM_TYPE = keyof typeof MERIDIEM_ENUM;

export const getSelectedMeridiem = (dateObj : Date) => {
  return dateObj.getHours() < TWELVE_HOUR_LIMIT ? MERIDIEM_ENUM.AM : MERIDIEM_ENUM.PM;
};

export const getValue = (value : number, limit : number) => {
  const mod = value % limit;
  if (mod !== 0) {
    return mod;
  }
  return limit;
};

const TWELVE_HOURS_ARRAY = new Array(TWELVE_HOUR_LIMIT).fill(1).map(arrayFillCB);

export const TWELVE_HOURS_ARRAY_REARRANGED = <number[]>[TWELVE_HOURS_ARRAY.pop()].concat(TWELVE_HOURS_ARRAY);

export const getTwentyFourHourRepresentation = (hour : number) => {
    return TWELVE_HOUR_LIMIT + hour;
};
export const MINUTE_ARRAY = new Array(60).fill(0).map(arrayFillCB);

export const MERIDIEM_ARRAY = Object.values(MERIDIEM_ENUM);

export const TWENTY_FOUR_HOURS_ARRAY = new Array(24).fill(0).map(arrayFillCB);

export enum TIME_FORMAT_ENUM {
  TWELVE_HOUR_FORMAT = 'TWELVE_HOUR_FORMAT',
  TWENTY_FOUR_HOUR_FORMAT = 'TWENTY_FOUR_HOUR_FORMAT'
}
