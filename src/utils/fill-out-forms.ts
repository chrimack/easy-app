import { FormHeaders } from '../constants';

const handlers = {
  [FormHeaders.AdditionalQuestions]: handleSubmitAdditionalQuestions,
  [FormHeaders.Contact]: handleSubmitDefault,
  [FormHeaders.Diversity]: handleSubmitDiversity,
  [FormHeaders.HomeAddress]: handleSubmitHomeAddress,
  [FormHeaders.Resume]: handleSubmitResume,
  [FormHeaders.WorkAuthorization]: handleSubmitWorkAuth,
  default: handleSubmitDefault,
};
