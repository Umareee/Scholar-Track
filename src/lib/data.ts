import { ScholarshipApplication, DOCUMENT_CHECKLIST_ITEMS } from './types';

const today = new Date();

const createDate = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const initialApplications: ScholarshipApplication[] = [];
