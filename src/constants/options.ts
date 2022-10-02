/**
 * common options of select elements
 */
export const Options = {
  English: { Native: 'native', Fluent: 'fluent' },
  Polar: { Yes: 'yes', No: 'no' },
};

/**
 * phrase to match with labels of select elements
 */
export const Phrases = {
  Citizen: /\bus citizen\b/,
  English: /\benglish\b/,
  MinimumExp: /\bminimum of \b\b0*(?:[2-9]|[1-9]\d\d*)\b/,
};

// check specifically for English and other languages
('What is your level of proficiency in English? ');

// Steps for Polar questions
// check for minimum of [nummber > 1]
('Do you have a minimum of 5 years of experience in REST API? ');

('Do you have experience with ETL processes? ');
('Are you currently a US Citizen or Green Card Holder? ');
('Do you have direct experience architecting or experience in contributing to decision making regarding front-end technologies? ');

('Are you currently living in St. Louis (or St. Charles/St. Peters), Missouri or 100 mile radius or (if outside of St. Louis) willing to relocate to St. Louis if offered this job? ');

`Do you have experience in developing, integrating, creating custom API's? `;

('Do you have any experience in creating, implementing, coding IDE plugins/Extensions. ');

('Do you have any experience in developing AST Parsers? ');
