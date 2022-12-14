import { By, WebElement } from 'selenium-webdriver';

import {
  Attributes,
  ClassNames,
  Errors,
  IDs,
  Logs,
  SECOND,
  Selectors,
  URLs,
} from '../constants';
import { FilterParams } from '../interfaces';
import { buildUrl } from '../utils';
import { ApplicationHandler } from './application-handler';
import { Driver, Logger, Result } from './index';
import { Submitter } from './submitter';

export class Navigator {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
  }

  async debugJob() {
    await this.searchDebugJob();
    await this.clickEasyApply();
    const container = await this.getFormContainer();
    if (container === null) return;
    const submitter = new Submitter(container, this.driver);
    await submitter.processApplication();
  }

  async getPageByNumber(pageNumber: number) {
    try {
      const pages = await this.getPages();

      for (const page of pages) {
        const button = await page.findElement(By.css(Selectors.Button));
        const aria = await button.getAttribute(Attributes.AriaLabel);

        if (aria === `Page ${pageNumber}`) return button;
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async goToNextPage(currentPageNumber: number) {
    const next = currentPageNumber + 1;
    const nextPage = await this.getPageByNumber(next);

    if (nextPage === null) return null;

    await this.driver.click(nextPage);
    Logger.logInfo(`clicked page ${next}`);

    await this.driver.waitASecond();

    // after navigating to the next page, the nextPage element becomes stale
    return this.getPageByNumber(next);
  }

  async processPage(page: WebElement, total: number) {
    await this.driver.delay();

    const jobs = await this.getJobs(page);
    if (jobs.length === 0) return total;

    const newTotal = this.processJobs(jobs, total);
    return newTotal;
  }

  async searchJobs(params: FilterParams) {
    const url = buildUrl(params).toString();

    try {
      await this.driver.get(url);
      await this.driver.waitASecond();
      await this.driver.waitForPageLoad();
      await this.driver.hideElementById(IDs.MsgOverlayId);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  async start(username: string, password: string) {
    await this.goToLinkedIn();
    await this.goToSignInPage();
    await this.login(username, password);
  }

  private async processJobs(jobs: WebElement[], total: number) {
    for (const job of jobs) {
      const result = await this.processJob(job);
      if (result.isSubmitted) total++;
    }

    return total;
  }

  private async processJob(job: WebElement) {
    const result = await this.startApplication(job);
    if (result.isSkipped) return result;

    const container = await this.getFormContainer();
    if (container === null) {
      Logger.logWarning(Logs.Skipped);
      return Result.skipped;
    }

    const submitter = new Submitter(container, this.driver);
    const { isSkipped, isSubmitted } = await submitter.processApplication();

    if (!isSkipped && !isSubmitted) {
      const app = new ApplicationHandler(container, this.driver);
      await app.closeApplication();
      return Result.skipped;
    }

    return Result.submit(isSubmitted);
  }

  private async clickEasyApply() {
    try {
      const hasErrors = await this.hasErrors();
      if (hasErrors) Result.skipped;

      const applyButton = await this.driver.getFirstElementByClassname(
        ClassNames.ApplyButtons,
        30 * SECOND
      );

      if (applyButton === undefined) throw new Error();

      await this.driver.click(applyButton);
      return Result.empty;
    } catch (error) {
      Logger.logError(Errors.APPLY_NOT_FOUND);
      return Result.skipped;
    }
  }

  private async getFormContainer() {
    try {
      const container = await this.driver.getFirstElementByClassname(
        ClassNames.EasyApplyContent,
        30 * SECOND
      );

      if (container === undefined) {
        Logger.logError(Errors.FORM_NOT_FOUND);
        return null;
      }

      return container;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async getJobs(page: WebElement) {
    try {
      await this.driver.scrollIntoView(page);
      await this.driver.waitASecond();

      const jobs = await this.driver.getElementsByClassname(
        ClassNames.JobTitle,
        30 * SECOND
      );

      Logger.jobsFound(jobs.length);
      return jobs;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async goToLinkedIn() {
    try {
      await this.driver.get(URLs.Home);
      await this.driver.waitASecond();
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.LinkedInLoaded);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  private async goToSignInPage() {
    try {
      const signInButton = await this.driver.getFirstElementByClassname(
        ClassNames.SignIn
      );

      if (signInButton === undefined) throw new Error(Errors.ELEMENT_NOT_FOUND);

      await this.driver.click(signInButton);
      await this.driver.waitASecond();
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.SignInLoaded);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  private async login(username: string, password: string) {
    try {
      const [usernameInput, passwordInput] = await Promise.all([
        this.driver.getElementById(IDs.UserNameId),
        this.driver.getElementById(IDs.PasswordId),
      ]);

      await Promise.all([
        this.driver.insertValue(usernameInput, username),
        this.driver.insertValue(passwordInput, password),
      ]);

      await passwordInput.submit();
      await this.driver.waitASecond();
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.LoggedIn);
    } catch (error) {
      Logger.logError(Errors.LOGIN_FAILED);
      this.driver.quit();
    }
  }

  private async searchDebugJob() {
    try {
      await this.driver.get(URLs.DebugJob);
      await this.driver.waitASecond();
      await this.driver.waitForPageLoad();
      await this.driver.hideElementById(IDs.MsgOverlayId);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  private async startApplication(job: WebElement) {
    await this.driver.click(job);
    job.getText().then((title) => Logger.appStarted(title));

    await this.driver.holdYourHorses();
    const result = await this.clickEasyApply();

    Logger.logResult(result);
    return result;
  }

  private async hasErrors() {
    try {
      const errors = await this.driver.getElementsByClassname(
        ClassNames.EasyApplyError,
        SECOND
      );

      if (errors.length > 0) return true;
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * finds the pager element on the job search page then finds each li element for the pages
   * if there is an error it returns an empty array and the app will end
   */
  private async getPages() {
    try {
      const pager = await this.driver.getFirstElementByClassname(
        ClassNames.Pager
      );
      // TODO: get the error type from selenium => element not found exception or whatever
      if (pager === undefined) throw new Error(Errors.PAGER_NOT_FOUND);

      const pages = await pager.findElements(By.css(Selectors.ListItem));
      if (pages.length === 0) throw new Error(Errors.PAGES_NOT_FOUND);

      return pages;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
