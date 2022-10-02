interface IResult {
  isSkipped: boolean;
  isSubmitted: boolean;
}

export class Result {
  static empty: IResult = { isSkipped: false, isSubmitted: false };

  static skipped: IResult = { isSkipped: true, isSubmitted: false };

  static submit(isSubmitted: boolean): IResult {
    return { isSkipped: false, isSubmitted };
  }
}
