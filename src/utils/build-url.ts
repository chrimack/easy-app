import { QueryKeys, QueryValues, URLs } from '../constants';
import { FilterParams } from '../interfaces';

export const buildUrl = (params: FilterParams) => {
  const url = new URL(URLs.JobSearch);

  url.searchParams.append(QueryKeys.easyApply, 'true');
  url.searchParams.append(QueryKeys.keywords, params.keywords);

  const { experience, jobType, location } = params.filters;

  if (experience.length) {
    const filters = experience.map((x) => QueryValues.experience[x]);

    url.searchParams.append(QueryKeys.experience, filters.join(','));
  }

  if (jobType.length) {
    const filters = jobType.map((x) => QueryValues.jobType[x]);

    url.searchParams.append(QueryKeys.jobType, filters.join(','));
  }

  if (location.length) {
    const filters = location.map((x) => QueryValues.location[x]);

    url.searchParams.append(QueryKeys.location, filters.join(','));
  }

  return url;
};
