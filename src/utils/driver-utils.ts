import { By, until, WebElement } from 'selenium-webdriver';
import { SECOND, Selectors } from '../constants';
import { driver } from '../driver';

/**
 * attempts to click the given WebElement
 */
async function click(element: WebElement) {
  try {
    await scrollIntoView(element);

    await driver.wait(until.elementIsEnabled(element), 30 * SECOND);

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
const delay = async (ms = 3 * SECOND) => await driver.sleep(ms);

/**
 * waits up to 10 seconds for element to appear in the DOM, then returns element
 * @param id
 */
const getElementById = async (id: string) =>
  await driver.wait(until.elementLocated(By.id(id)), 10 * SECOND);

/**
 * waits up to [delay] miliseconds for elements to appear in the DOM, then returns list of elements
 * @param classname
 * @param delay number of miliseconds to wait
 * @default 10000
 */
const getElementsByClassname = async (
  classname: string,
  delay: number = 10 * SECOND
) => await driver.wait(until.elementsLocated(By.className(classname)), delay);

const getFirstElementByClassname = async (classname: string, delay?: number) =>
  (await getElementsByClassname(classname, delay)).at(0);

const getSiblingHelper = (element: Element) => element.nextElementSibling;

/**
 * attempts to get an Element's next sibling and return it as a WebElement
 */
async function getSibling(element: WebElement) {
  const sibling = await driver.executeScript<WebElement | null>(
    getSiblingHelper,
    element
  );

  return sibling;
}

const hideElementHelper = (id: string) =>
  document.querySelector(`#${id}`)?.setAttribute('style', 'display: none');

/**
 * hides the element matching the id
 */
const hideElementById = async (id: string) =>
  await driver.executeScript<void>(hideElementHelper, id);

/**
 * inserts text into an input element
 */
async function insertValue(element: WebElement, value: string) {
  const tag = await element.getTagName();
  const type = await element.getAttribute('type');

  if (tag !== Selectors.Input && type !== 'text') throw new Error();

  await element.clear();
  await element.sendKeys(value);
}

const scrollHelper = (element: Element) => element.scrollIntoView();

/**
 * attempts to scroll the given WebElement into the view port
 */
const scrollIntoView = async (element: WebElement) =>
  await driver.executeScript<void>(scrollHelper, element);

/**
 * waits for an element to appear in the DOM
 * @param delay ms to wait
 * @default 10000
 */
const waitForElement = async (className: string, delay: number = 10 * SECOND) =>
  await driver.wait(until.elementsLocated(By.className(className)), delay);

/**
 * waits for the browser to reach the 'complete' readyState
 * will wait for 30 seconds before throwing an error
 */
async function waitForPageLoad() {
  const wait = async () => {
    const status = await driver.executeScript(() => document.readyState);

    return status === 'complete';
  };

  await driver.wait(wait, 30 * SECOND);
}

export const DriverUtils = {
  click,
  delay,
  getElementById,
  getElementsByClassname,
  getFirstElementByClassname,
  getSibling,
  insertValue,
  scrollIntoView,
  waitForPageLoad,
};
