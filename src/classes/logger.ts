import boxen, { Options } from 'boxen';
import chalk, { ChalkInstance } from 'chalk';
import { Logs } from '../constants';
import { Result } from '../interfaces';

export class Logger {
  static logError(msg: string) {
    console.log(boxen(this.error(msg), this.errorBox));
  }

  static logInfo(msg: string) {
    console.log(this.info(msg));
  }

  static logResult(result: Result) {
    if (result.isSkipped) this.logWarning(Logs.Skipped);
    if (result.isSubmitted) this.logSuccess(Logs.Applied);
  }

  static logSuccess(msg: string) {
    console.log(boxen(this.success(msg), this.successBox));
  }

  static logWarning(msg: string) {
    console.log(this.warning(msg));
  }

  static logTitle() {
    console.log(boxen(this.title, this.titleBox));
  }

  static appStarted(title: string) {
    this.logInfo(`Application started for ${title}`);
  }

  static jobsFound(numberOfJobs: number) {
    this.logInfo(`${numberOfJobs} jobs found`);
  }

  static totalJobs(total: number) {
    this.success(`You successfullly applied to ${total} jobs`);
  }

  private static error: ChalkInstance = chalk.redBright;
  private static info: ChalkInstance = chalk.cyanBright;
  private static success: ChalkInstance = chalk.green;
  private static warning: ChalkInstance = chalk.hex('#FFA500');

  private static errorBox: Options = {
    borderColor: 'red',
    borderStyle: 'arrow',
    padding: { top: 0, right: 2, bottom: 0, left: 2 },
    textAlignment: 'center',
    title: chalk.red.bold('Error'),
    titleAlignment: 'center',
  };

  private static successBox: Options = {
    borderColor: 'green',
    borderStyle: 'bold',
  };

  private static titleBox: Options = {
    borderColor: 'blue',
    borderStyle: 'bold',
    padding: 1,
    textAlignment: 'center',
  };

  private static easyApply: string = `
                                          __
   ___  ____ ________  __   ____ _____  ____  / /_  __
  / _ \\/ __ \`/ ___/ / / /  / __ \`/ __ \\/ __ \\/ / / / /
 /  __/ /_/ (__  ) /_/ /  / /_/ / /_/ / /_/ / / /_/ /
\\___/\\__,_/____/\\__, /   \\__,_/ .___/ .___/_/\\__, /
              /____/        /_/   /_/      /____/
`;

  private static title: string = chalk.cyanBright(this.easyApply);
}
