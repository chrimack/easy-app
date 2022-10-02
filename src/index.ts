import { Builder } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome'

const getDriver = async () => {
    try {
        // TODO: figure out path
        const service = new chrome.ServiceBuilder('')

        const driver = await new Builder()
            .forBrowser('chrome')
            .setChromeService(service)
            .build();

        return driver
    } catch (error) {
        console.error(error);
        throw new Error('Driver failed');
    }
}