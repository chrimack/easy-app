import { By } from 'selenium-webdriver';
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
import { Driver, Logger } from './index';

export class Navigator {
  driver: Driver;

  constructor(driver: Driver) {
    this.driver = driver;
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

  async goToLinkedIn() {
    try {
      await this.driver.get(URLs.Home);
      await this.driver.delay(SECOND);
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.LinkedInLoaded);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  async goToSignInPage() {
    try {
      const signInButton = await this.driver.getFirstElementByClassname(
        ClassNames.SignIn
      );

      if (signInButton === undefined) throw new Error(Errors.ELEMENT_NOT_FOUND);

      await this.driver.click(signInButton);
      await this.driver.delay(SECOND);
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.SignInLoaded);
    } catch (error) {
      console.error(error);
      this.driver.quit();
    }
  }

  async login(username: string, password: string) {
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
      await this.driver.delay(SECOND);
      await this.driver.waitForPageLoad();
      Logger.logInfo(Logs.LoggedIn);
    } catch (error) {
      Logger.logError(Errors.LOGIN_FAILED);
      this.driver.quit();
    }
  }

  async searchJobs(params: FilterParams, debug: boolean = false) {
    const url = debug ? URLs.DebugJob : buildUrl(params).toString();

    try {
      await this.driver.get(url);
      await this.driver.delay(SECOND);
      await this.driver.waitForPageLoad();
      await this.driver.hideElementById(IDs.MsgOverlayId);
    } catch (error) {
      console.error(error);
      this.driver.quit();
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
