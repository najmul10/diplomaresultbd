/**
 * Shared TypeScript types for BTEB Results Zone.
 */
export type Department = {
  code: string;
  name: string;
  bn: string;
};

export type Institute = {
  code: string;
  name: string;
  district: string;
  type: "Government" | "Private";
};

export type Publication = {
  id: string;
  title: string;
  examType: string;
  semester: number;
  examYear: number;
  publicationDate: string;
  totalStudents: number;
  passRate: number;
};

export type SubjectResult = {
  code: string;
  name: string;
  credit: number;
  marks: number;
  letter: string;
  point: number;
};

export type StudentResult = {
  roll: string;
  registrationNo: string;
  name: string;
  instituteCode: string;
  instituteName: string;
  departmentCode: string;
  departmentName: string;
  semester: number;
  examYear: number;
  publicationId: string;
  publicationDate: string;
  subjects: SubjectResult[];
  gpa: number;
  letterGrade: string;
  result: "PASSED" | "FAILED";
  cgpa: number;
};

export type RoutineScheduleItem = {
  date: string;
  day: string;
  subjectCode: string;
  subjectName: string;
  time: string;
};

export type Routine = {
  id: string;
  title: string;
  semester: number;
  examYear: number;
  departmentCode: string;
  departmentName: string;
  startDate: string;
  endDate: string;
  schedule: RoutineScheduleItem[];
  publishedAt: string;
};

export type Book = {
  code: string;
  name: string;
  credit: number;
  author: string;
  edition: string;
  publisher: string;
};

export type Booklist = {
  id: string;
  departmentCode: string;
  departmentName: string;
  curriculumYear: number;
  totalBooks: number;
  books: Book[];
};

export type PlatformStats = {
  totalStudentsServed: number;
  totalResults: number;
  totalInstitutes: number;
  totalDepartments: number;
  totalPublications: number;
  totalRoutines: number;
  overallPassRate: number;
  yearsOfService: number;
  uptime: number;
  uniqueStudentsInDataset: number;
};
