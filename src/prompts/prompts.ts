import chalk from 'chalk';
import { CheckboxQuestion, InputQuestion, PasswordQuestion } from 'inquirer';
import { QueryValues } from '../constants';

const validate = (value: string) => {
  if (value.length === 0) return chalk.redBright('Enter a valid answer');

  return true;
};

const username: InputQuestion = {
  type: 'input',
  name: 'username',
  message: 'Enter your LinkedIn email',
  validate,
};

const password: PasswordQuestion = {
  type: 'password',
  name: 'password',
  message: 'Enter you LinkedIn password',
  mask: '*',
};

const keywords: InputQuestion = {
  type: 'input',
  name: 'keywords',
  message: 'What jobs do you want to search for?',
  validate,
};

const experienceFilters: CheckboxQuestion = {
  type: 'checkbox',
  name: 'experiences',
  message: 'Select experience filters',
  choices: Object.keys(QueryValues.experience).map((e) => ({ name: e })),
};

const jobTypeFilters: CheckboxQuestion = {
  type: 'checkbox',
  name: 'jobTypes',
  message: 'Select job type filters',
  choices: Object.keys(QueryValues.jobType).map((j) => ({ name: j })),
};

const locationFilters: CheckboxQuestion = {
  type: 'checkbox',
  name: 'locations',
  message: 'Select location filters',
  choices: Object.keys(QueryValues.location).map((l) => ({ name: l })),
};

export const prompts = [
  username,
  password,
  keywords,
  experienceFilters,
  jobTypeFilters,
  locationFilters,
];
