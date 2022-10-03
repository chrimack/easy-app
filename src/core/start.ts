import { Driver, Logger, Navigator } from '../classes';
import { Answers, FilterParams } from '../interfaces';

export async function start(answers: Answers) {
  console.time('process');

  const params: FilterParams = {
    keywords: answers.keywords,
    filters: {
      experiences: answers.experiences,
      jobTypes: answers.jobTypes,
      locations: answers.locations,
    },
  };

  const driver = await Driver.init();
  const navigator = new Navigator(driver);

  await navigator.start(answers.username, answers.password);
  await navigator.searchJobs(params);

  let currentPageNumber = 1;
  let currentPage = await navigator.getPageByNumber(currentPageNumber);
  let hasAnotherPage = true;
  let totalJobsApplied = 0;

  while (hasAnotherPage) {
    const totalForPage = await processPage(currentPage, totalJobsApplied);
    const nextPage = await navigator.goToNextPage(currentPageNumber);

    currentPageNumber++;
    currentPage = nextPage;
    hasAnotherPage = nextPage !== null;
    totalJobsApplied += totalForPage;
  }

  Logger.logSuccess(totalJobsApplied.toString());
  console.timeEnd('process');
  driver.quit();
}
