import { By, until, WebDriver, WebElement } from 'selenium-webdriver';

import { SECOND, Selectors } from '../constants';
import { getDriver } from '../driver';

export class Driver {
  driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  static async init() {
    const driver = await getDriver();
    return new Driver(driver);
  }

  /**
   * attempts to click the given WebElement
   */
  async click(element: WebElement) {
    try {
      await this.scrollIntoView(element);

      await this.driver.wait(until.elementIsEnabled(element), 30 * SECOND);

      await element.click();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * pauses script execution for number of miliseconds passed
   * @param ms miliseconds to delay
   * @default 3000
   */
  async delay(ms = 3 * SECOND) {
    return await this.driver.sleep(ms);
  }

  async get(url: string) {
    await this.driver.get(url);
  }

  /**
   * waits up to 10 seconds for element to appear in the DOM, then returns element
   * @param id
   */
  async getElementById(id: string) {
    return await this.driver.wait(until.elementLocated(By.id(id)), 10 * SECOND);
  }

  /**
   * waits up to [delay] miliseconds for elements to appear in the DOM, then returns list of elements
   * @param classname
   * @param delay number of miliseconds to wait
   * @default 10000
   */
  async getElementsByClassname(classname: string, delay: number = 10 * SECOND) {
    return await this.driver.wait(
      until.elementsLocated(By.className(classname)),
      delay
    );
  }

  async getFirstElementByClassname(classname: string, delay?: number) {
    return (await this.getElementsByClassname(classname, delay)).at(0);
  }

  /**
   * attempts to get an Element's next sibling and return it as a WebElement
   */
  async getSibling(element: WebElement) {
    const sibling = await this.driver.executeScript<WebElement | null>(
      this.getSiblingHelper,
      element
    );

    return sibling;
  }

  /**
   * hides the element matching the id
   */
  async hideElementById(id: string) {
    const element = await this.driver.wait(until.elementLocated(By.id(id)));
    await this.driver.wait(until.elementIsVisible(element));
    await this.driver.executeScript<void>(this.hideElementHelper, id);
  }

  /**
   * inserts text into an input element
   */
  async insertValue(element: WebElement, value: string) {
    const tag = await element.getTagName();
    const type = await element.getAttribute('type');

    if (tag !== Selectors.Input && type !== 'text') throw new Error();

    await element.clear();
    await element.sendKeys(value);
  }

  /**
   * attempts to scroll the given WebElement into the view port
   */
  async scrollIntoView(element: WebElement) {
    await this.driver.executeScript<void>(this.scrollHelper, element);
  }

  async quit() {
    await this.driver.quit();
  }

  /**
   * waits for the browser to reach the 'complete' readyState
   * will wait for 30 seconds before throwing an error
   */
  async waitForPageLoad() {
    await this.driver.wait(this.waitHelper, 30 * SECOND);
  }

  async waitASecond() {
    await this.delay(SECOND);
  }

  async holdYourHorses() {
    await this.delay(2 * SECOND);
  }

  private hideElementHelper = (id: string) =>
    document.querySelector(`#${id}`)?.setAttribute('style', 'display: none');

  private scrollHelper = (element: Element) => element.scrollIntoView();

  private getSiblingHelper = (element: Element) => element.nextElementSibling;

  private waitHelper = async () => {
    const status = await this.driver.executeScript(() => document.readyState);

    return status === 'complete';
  };

  /**
   * waits for an element to appear in the DOM
   * @param delay ms to wait
   * @default 10000
   */
  private async waitForElement(className: string, delay: number = 10 * SECOND) {
    await this.driver.wait(
      until.elementsLocated(By.className(className)),
      delay
    );
  }
}
