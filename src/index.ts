import inquirer from 'inquirer';
import { Answers } from './interfaces';

import { prompts } from './prompts';

const answers = await inquirer.prompt<Answers>(prompts);

console.log(answers);
