import {
  ExperienceValues,
  JobTypeValues,
  LocationValues,
} from './query-values';

export interface Answers {
  username: string;
  password: string;
  keywords: string;
  experiences: (keyof ExperienceValues)[];
  jobTypes: (keyof JobTypeValues)[];
  locations: (keyof LocationValues)[];
}
