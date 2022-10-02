import { By, WebElement } from 'selenium-webdriver';

import { Attributes, ClassNames, Errors, Form, Selectors } from '../constants';
import { Driver, Logger, Result } from './index';

export class ApplicationHandler {
  private container: WebElement;
  private driver: Driver;

  constructor(container: WebElement, driver: Driver) {
    this.container = container;
    this.driver = driver;
  }

  async checkForAndHandleErrors(header: string) {
    try {
      const currentHeader = await this.getHeader();

      if (currentHeader === header) {
        await this.handleFormErrors();
        return Result.skipped;
      }

      return Result.empty;
    } catch (error) {
      console.error(error);
      return Result.skipped;
    }
  }

  async closeApplication(shouldSave = false) {
    try {
      await this.closeModal();
      await this.driver.waitASecond();

      const buttonClass = shouldSave
        ? ClassNames.AlertModalSave
        : ClassNames.AlertModalDiscard;

      const button = await this.driver.getFirstElementByClassname(buttonClass);
      // TODO: handle this error
      if (button === undefined) return;

      await this.driver.click(button);
    } catch (error) {
      console.error(error);
    }
  }

  async closeModal() {
    try {
      const closeButton = await this.driver.getFirstElementByClassname(
        ClassNames.CloseModalButton
      );

      // TODO: handle this error
      if (closeButton === undefined) return;

      await this.driver.click(closeButton);
    } catch (error) {
      console.error(error);
    }
  }

  async getContinueButton() {
    try {
      const buttons = await this.container.findElements(
        By.css(Selectors.Button)
      );

      for (const button of buttons) {
        const aria = (
          await button.getAttribute(Attributes.AriaLabel)
        )?.toLowerCase();

        if (aria?.includes(Form.SubmitAria)) return { button, isSubmit: true };

        if (aria?.includes(Form.NextAria) || aria?.includes(Form.ReviewAria)) {
          return { button, isSubmit: false };
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getHeader() {
    try {
      const headers = await this.container.findElements(By.css(Selectors.H3));
      const header = await headers.at(0)?.getText();
      if (header === undefined)
        return Logger.logError(Errors.ELEMENT_NOT_FOUND);

      return header;
    } catch (error) {
      console.error(error);
    }
  }

  async getInputs() {
    try {
      const inputs = await this.container.findElements(By.css(Selectors.Input));
      if (inputs.length === 0) throw new Error(Errors.ELEMENT_NOT_FOUND);

      return inputs;
    } catch (error) {
      console.error(error);
    }
  }

  async getLabels() {
    try {
      const labels = await this.container.findElements(By.css(Selectors.Label));
      return labels;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getSelects() {
    try {
      const selects = await this.container.findElements(
        By.css(Selectors.Select)
      );
      return selects;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async processRadioInput(input: WebElement) {
    try {
      const parent = await input.findElement(By.xpath('..'));
      const label = await parent.findElement(By.css(Selectors.Label));
      await this.driver.click(label);
    } catch (error) {
      console.error(error);
    }
  }

  async unCheckFollow() {
    try {
      const footer = await this.container.findElement(By.css(Selectors.Footer));
      const labels = await footer.findElements(By.css(Selectors.Label));

      if (labels.length === 0) return;

      for (const label of labels) {
        const labelFor = await label.getAttribute(Attributes.For);
        if (labelFor === Form.FollowLabel) await this.driver.click(label);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private async handleFormErrors() {
    try {
      const hasErrors = await this.hasFormErrors();
      if (hasErrors) return await this.closeApplication();

      return;
    } catch (error) {
      console.error(error);
    }
  }

  private async hasFormErrors() {
    try {
      const inputErrors = await this.container.findElements(
        By.className(ClassNames.ErrorTextForm)
      );

      for (const error of inputErrors) {
        const text = await error.getText();
        if (text === Form.ErrorText) return true;
      }

      const docUploadErrors = await this.container.findElements(
        By.className(ClassNames.ErrorTextDocUpload)
      );

      for (const error of docUploadErrors) {
        const role = await error.getAttribute(Attributes.Role);
        const text = (await error.getText()).toLowerCase();
        if (role === Form.Alert && text.includes(Form.Required)) return true;
      }

      return false;
    } catch (error) {
      console.error(error);
    }
  }
}
