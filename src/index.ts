import inquirer from 'inquirer';
import { Logger } from './classes';
import { Answers } from './interfaces';

import { prompts } from './prompts';

Logger.logTitle();
const answers = await inquirer.prompt<Answers>(prompts);

console.log(answers);
