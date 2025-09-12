export type ApplicationStatus = 'Not Started' | 'In Progress' | 'Submitted' | 'Accepted' | 'Rejected';

export const ALL_STATUSES: ApplicationStatus[] = ['Not Started', 'In Progress', 'Submitted', 'Accepted', 'Rejected'];

export const DOCUMENT_CHECKLIST_ITEMS = ["CV/Resume", "Personal Statement", "Recommendation Letters", "Transcripts"] as const;

export type DocumentName = typeof DOCUMENT_CHECKLIST_ITEMS[number];

export type Document = {
  name: DocumentName;
  checked: boolean;
};

export type ScholarshipApplication = {
  id: string;
  scholarshipName: string;
  university: string;
  country: string;
  deadline: string; // ISO Date string
  status: ApplicationStatus;
  documents: Document[];
  notes: string;
};
