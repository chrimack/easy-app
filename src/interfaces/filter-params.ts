import {
  ExperienceValues,
  JobTypeValues,
  LocationValues,
} from './query-values';

export interface FilterParams {
  keywords: string;
  filters: {
    experience: (keyof ExperienceValues)[];
    jobType: (keyof JobTypeValues)[];
    location: (keyof LocationValues)[];
  };
}
