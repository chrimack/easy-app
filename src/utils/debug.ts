import { Driver, Navigator } from '../classes';

export async function debug(username: string, password: string) {
  const driver = await Driver.init();
  const navigator = new Navigator(driver);

  await navigator.start(username, password);

  await driver.waitASecond();

  await navigator.debugJob();
}
