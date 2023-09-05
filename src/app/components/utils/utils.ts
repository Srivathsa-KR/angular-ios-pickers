export const ALLOWED_DATES_ENUM = {
    FUTURE_DATES: 'FUTURE_DATES',
    ALL_DATES: 'ALL_DATES',
    PAST_DATES: 'PAST_DATES',
  };

export type ALLOWED_DATES_TYPE = keyof typeof ALLOWED_DATES_ENUM;

export function getClosestArrayElementToTarget(targetNum: number, numArray: number[]) {
    return numArray.reduce(
      (acc, currEle) => (Math.abs(currEle - targetNum) < Math.abs(acc - targetNum) ? currEle : acc),
    );
  }

  export const getMaxDaysInMonth = (year: number, month : number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  //Taking year as a parameter to account for the edge case of Feb in a leap year
  export const getListOfAllDates = (year : number, month : number) => {
    return new Array(getMaxDaysInMonth(year, month)).fill(1).map((value, index) => value + index);
  };

  export const getMinimum = (...numList: number[]) => {
    return Math.min(...numList);
  }
