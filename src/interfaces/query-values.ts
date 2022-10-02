export interface QueryValues {
  experience: ExperienceValues;
  jobType: JobTypeValues;
  location: LocationValues;
}

export interface ExperienceValues {
  Internship: '1';
  'Entry Level': '2';
  Associate: '3';
  'Mid-Senior': '4';
}

export interface JobTypeValues {
  'Full-time': 'F';
  'Part-time': 'P';
  Contract: 'C';
  Temporary: 'T';
  Volunteer: 'V';
  Internship: 'I';
}

export interface LocationValues {
  'On-site': '1';
  Remote: '2';
  Hybrid: '3';
}
