import {
  ExperienceValues,
  JobTypeValues,
  LocationValues,
} from './query-values';

export interface FilterParams {
  keywords: string;
  filters: {
    experiences: (keyof ExperienceValues)[];
    jobTypes: (keyof JobTypeValues)[];
    locations: (keyof LocationValues)[];
  };
}
