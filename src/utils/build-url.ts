import { QueryKeys, QueryValues, URLs } from '../constants';
import { FilterParams } from '../interfaces';

export const buildUrl = (params: FilterParams) => {
  const url = new URL(URLs.JobSearch);

  url.searchParams.append(QueryKeys.easyApply, 'true');
  url.searchParams.append(QueryKeys.keywords, params.keywords);

  const { experiences, jobTypes, locations } = params.filters;

  if (experiences.length) {
    const filters = experiences.map((x) => QueryValues.experience[x]);

    url.searchParams.append(QueryKeys.experience, filters.join(','));
  }

  if (jobTypes.length) {
    const filters = jobTypes.map((x) => QueryValues.jobType[x]);

    url.searchParams.append(QueryKeys.jobType, filters.join(','));
  }

  if (locations.length) {
    const filters = locations.map((x) => QueryValues.location[x]);

    url.searchParams.append(QueryKeys.location, filters.join(','));
  }

  return url;
};
