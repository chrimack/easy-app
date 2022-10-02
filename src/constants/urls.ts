export const URLs = {
  Home: 'http://www.linkedin.com',
  JobSearch: 'https://www.linkedin.com/jobs/search',

  // use this property to target a specific job posting that causes an error
  DebugJob:
    'https://www.linkedin.com/jobs/search/?currentJobId=3282033009&f_AL=true&f_E=2%2C3&f_JT=F&f_WT=2&keywords=react&start=50',
};
('f_WT=1%2C2%2C3&');

('f_JT=F,P,C,T,V,I');

('f_E=1,2,3,4');

// just a search keyword
// keywords={search+term}
('https://www.linkedin.com/jobs/search/?keywords=react');

// remote filter
// f_WT=2
('https://www.linkedin.com/jobs/search/?keywords=react&f_WT=2');

// experience filter
// entry = f_E=2
// entry & associate = f_E=2%2C3
('https://www.linkedin.com/jobs/search/?keywords=react&f_E=2');

// full-time filter
// f_JT=F
('https://www.linkedin.com/jobs/search/?keywords=react&f_JT=F');

// easy apply filter
// &f_AL=true
('https://www.linkedin.com/jobs/search/?keywords=react&f_AL=true');

('https://www.linkedin.com/jobs/search/?keywords=react&f_AL=true&f_WT=2&f_E=2%2C3&f_JT=F');

// this job requires a cover letter, saving it in case i need to test again
// TODO
('https://www.linkedin.com/jobs/search/?currentJobId=3247058503&f_AL=true&f_E=2%2C3&f_JT=F&f_WT=2&keywords=react&start=200');
