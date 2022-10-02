import { QueryValues as Values } from '../interfaces';

export const QueryKeys = {
  easyApply: 'f_AL',
  keywords: 'keywords',
  location: 'f_WT',
  jobType: 'f_JT',
  experience: 'f_E',
};

export const QueryValues: Values = {
  location: {
    'On-site': '1',
    Remote: '2',
    Hybrid: '3',
  },
  jobType: {
    'Full-time': 'F',
    'Part-time': 'P',
    Contract: 'C',
    Temporary: 'T',
    Volunteer: 'V',
    Internship: 'I',
  },
  experience: {
    Internship: '1',
    'Entry Level': '2',
    Associate: '3',
    'Mid-Senior': '4',
  },
};
