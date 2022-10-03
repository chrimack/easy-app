import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export const getDriver = async () => {
  try {
    const service = new chrome.ServiceBuilder('chromedriver/chromedriver');

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

    return driver;
  } catch (error) {
    console.error(error);
    throw new Error('Driver failed');
  }
};
