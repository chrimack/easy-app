import { By, WebElement } from 'selenium-webdriver';

import {
  Attributes,
  ClassNames,
  FormHeaders,
  Logs,
  Selectors,
} from '../constants';
import { ApplicationHandler } from './application-handler';
import { Driver, Logger, Result } from './index';
import { Result as IResult } from '../interfaces';

export class Submitter {
  private applicator: ApplicationHandler;
  private container: WebElement;
  private driver: Driver;

  constructor(container: WebElement, driver: Driver) {
    this.applicator = new ApplicationHandler(container, driver);
    this.container = container;
    this.driver = driver;
  }

  async processApplication(): Promise<IResult> {
    let result = Result.empty;

    const header = await this.applicator.getHeader();
    if (header === FormHeaders.Review) {
      result = await this.handleSubmitApplication();
      Logger.logResult(result);
      return result;
    }

    const fn =
      this.handlers[header] === undefined
        ? this.handlers.default.bind(this)
        : this.handlers[header].bind(this);

    result = await fn(header);

    if (result.isSkipped || result.isSubmitted) {
      Logger.logResult(result);
      return result;
    }

    return await this.processApplication();
  }

  private handlers = {
    [FormHeaders.AdditionalQuestions]: this.handleSubmitAdditionalQuestions,
    [FormHeaders.WorkAuthorization]: this.handleSubmitWorkAuth,
    default: this.handleSubmitDefault,
  };

  private async handleSubmitAdditionalQuestions(header: string) {
    let result = await this.submitAdditionalQuestions();
    if (result.isSubmitted || result.isSkipped) return result;

    await this.driver.holdYourHorses();

    result = await this.applicator.checkForAndHandleErrors(header);
    return result;
  }

  private async handleSubmitApplication() {
    const isSubmitted = await this.submitApplication();
    return Result.submit(isSubmitted);
  }

  private async handleSubmitDefault(header: string) {
    let result = await this.submitDefault();
    if (result.isSkipped || result.isSubmitted) return result;

    await this.driver.holdYourHorses();

    result = await this.applicator.checkForAndHandleErrors(header);
    return result;
  }

  private async handleSubmitWorkAuth(header: string) {
    let result = await this.submitWorkAuthorization();
    if (result.isSkipped || result.isSubmitted) return result;

    await this.driver.holdYourHorses();

    result = await this.applicator.checkForAndHandleErrors(header);
    return result;
  }

  private async submitAdditionalQuestions() {
    try {
      // TODO: check for yes/no questions
      const selects = await this.applicator.getSelects();
      if (selects.length > 0) {
        await this.applicator.closeApplication();
        return Result.skipped;
      }

      const inputs = await this.applicator.getInputs();
      await Promise.all(inputs?.map((i) => this.processTextInput(i)));

      const isSubmitted = await this.applicator.handleContinue();
      return Result.submit(isSubmitted);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  private async submitApplication() {
    try {
      const isSubmitted = await this.applicator.handleContinue();

      // after the application is submitted, there is another modal we don't care about
      // TODO: for testing the handleContinue modal will close the application without
      // submitting. Uncomment this line when that is updated
      // await ApplicationUtils.closeModal();

      return isSubmitted;
    } catch (error) {
      console.error(error);
      Logger.logWarning(Logs.Skipped);

      // TODO: decide when to pass save flag
      await this.applicator.closeApplication();
      return false;
    }
  }

  private async submitDefault() {
    try {
      const isSubmitted = await this.applicator.handleContinue();
      return Result.submit(isSubmitted);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  private async submitWorkAuthorization() {
    try {
      const fields = await this.container.findElements(
        By.css(Selectors.FieldSet)
      );

      await Promise.all(fields.map((f) => this.processField(f)));

      const isSubmitted = await this.applicator.handleContinue();
      return Result.submit(isSubmitted);
    } catch (error) {
      return await this.handleError(error);
    }
  }

  private async getRadioInputs(field: WebElement) {
    return await field.findElements(By.css(Selectors.Input));
  }

  private async handleError(error: unknown) {
    console.error(error);
    await this.applicator.closeApplication();
    return Result.skipped;
  }

  /**
   * Handle fieldsets from the Work Auth stage
   */
  private async processField(field: WebElement) {
    const label = await field.findElement(
      By.className(ClassNames.WorkAuthQuestion)
    );
    const question = await label.getText();

    const inputs = await this.getRadioInputs(field);

    await Promise.all(inputs.map((i) => this.processRadioInput(i, question)));
  }

  /**
   * Handle the radio inputs from the Work Auth stage
   */
  private async processRadioInput(input: WebElement, question: string) {
    const text = await input.getAttribute(Attributes.Value);

    // check if the question is about requiring visa sponsorship
    // if true, then click 'No'
    // otherwise I probably want the answer to be 'Yes'
    if (question.includes('sponsorship') && text === 'No')
      this.applicator.processRadioInput(input);

    if (!question.includes('sponsorship') && text === 'Yes')
      this.applicator.processRadioInput(input);
  }

  /**
   * Handle the text and radio inputs for the Additional Questions stage
   */
  private async processTextInput(input: WebElement) {
    try {
      const text = await input.getAttribute(Attributes.Value);
      const type = await input.getAttribute(Attributes.Type);

      if (type === 'radio' && text === 'Yes') {
        await this.applicator.processRadioInput(input);
        return;
      }

      // usually these questions are how much experience do you have
      // with [tech]. LinkedIn does a good job of filling out the stuff
      // that is in the resume. Anything that is empty gets a 1.
      if (text === '' || text === null) await input.sendKeys('1');
    } catch (error) {
      console.error(error);
    }
  }
}
