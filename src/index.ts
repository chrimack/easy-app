import inquirer from 'inquirer';

import { Logger } from './classes';
import { start } from './core/start';
import { Answers } from './interfaces';
import { prompts } from './prompts';

Logger.logTitle();
const answers = await inquirer.prompt<Answers>(prompts);

start(answers);
