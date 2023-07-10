export const TIME_FORMAT_ENUM = {
    TWELVE_HOUR_FORMAT: 'HOUR12',
    TWENTY_FOUR_HOUR_FORMAT: 'HOUR24',
};

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
