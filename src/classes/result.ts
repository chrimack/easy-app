export class Result {
  static empty = { isSkipped: false, isSubmitted: false };

  static skipped = { isSkipped: true, isSubmitted: false };

  static submit(isSubmitted: boolean) {
    return { isSkipped: false, isSubmitted };
  }
}
