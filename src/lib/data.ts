import { ScholarshipApplication, DOCUMENT_CHECKLIST_ITEMS } from './types';

const today = new Date();

const createDate = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const initialApplications: ScholarshipApplication[] = [
  {
    id: 'app-1',
    scholarshipName: 'Rhodes Scholarship',
    university: 'University of Oxford',
    country: 'United Kingdom',
    deadline: createDate(60),
    status: 'Not Started',
    priority: 'High',
    documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: false })),
    notes: 'Requires 5-8 recommendation letters.',
  },
  {
    id: 'app-2',
    scholarshipName: 'Fulbright Foreign Student Program',
    university: 'Various Universities',
    country: 'USA',
    deadline: createDate(5),
    status: 'In Progress',
    priority: 'High',
    documents: [
      { name: 'CV/Resume', checked: true },
      { name: 'Personal Statement', checked: true },
      { name: 'Recommendation Letters', checked: false },
      { name: 'Transcripts', checked: true },
    ],
    notes: 'Finalizing personal statement. Need to request one more recommendation.',
  },
  {
    id: 'app-3',
    scholarshipName: 'Chevening Scholarship',
    university: 'Any UK University',
    country: 'United Kingdom',
    deadline: createDate(120),
    status: 'Not Started',
    priority: 'Medium',
    documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: false })),
    notes: 'Minimum two years of work experience required.',
  },
  {
    id: 'app-4',
    scholarshipName: 'DAAD Scholarship',
    university: 'Various Universities',
    country: 'Germany',
    deadline: createDate(-10),
    status: 'Submitted',
    priority: 'None',
    documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: true })),
    notes: 'Submitted via the DAAD portal on time.',
  },
  {
    id: 'app-5',
    scholarshipName: 'Gates Cambridge Scholarship',
    university: 'University of Cambridge',
    country: 'United Kingdom',
    deadline: createDate(25),
    status: 'In Progress',
    priority: 'Medium',
    documents: [
      { name: 'CV/Resume', checked: true },
      { name: 'Personal Statement', checked: false },
      { name: 'Recommendation Letters', checked: false },
      { name: 'Transcripts', checked: true },
    ],
    notes: 'Drafting the specific Gates Cambridge statement.',
  },
  {
    id: 'app-6',
    scholarshipName: 'Knight-Hennessy Scholarship',
    university: 'Stanford University',
    country: 'USA',
    deadline: createDate(-90),
    status: 'Rejected',
    priority: 'Low',
    documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: true })),
    notes: 'Did not pass the first review stage. Re-applying next year.',
  },
  {
    id: 'app-7',
    scholarshipName: 'Erasmus Mundus Joint Masters',
    university: 'Multiple EU Universities',
    country: 'Europe',
    deadline: createDate(-200),
    status: 'Accepted',
    priority: 'None',
    documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: true })),
    notes: 'Accepted into the "MARHE" program. Starting in September!',
  },
];
