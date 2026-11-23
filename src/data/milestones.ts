/**
 * Company milestones.
 *
 * [TODO-CLIENT] Supply the dates. The timeline component on /about is built and
 * wired, but this array is deliberately empty: the section does not render
 * while it is, and no founding date, expansion year or headcount figure has
 * been invented to fill it. Add entries in chronological order and the section
 * appears with no further code change.
 *
 * Example of the shape expected:
 *   { year: '2014', title: 'Company incorporated', description: '…' },
 */

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

/*
 * Still empty, deliberately. The registration date (15 April 2022) was tried
 * here as a single entry and read as thin: a full section headed "How the
 * business got here." over one line, repeating a date GOVERNANCE already states
 * on the same page. Add it back as the first entry once there is a second
 * milestone to put after it:
 *   { year: '2022', title: 'Fegeh Logistics registered',
 *     description: 'Registered as a business name in Ghana on 15 April 2022.' },
 */
export const MILESTONES: Milestone[] = [];
