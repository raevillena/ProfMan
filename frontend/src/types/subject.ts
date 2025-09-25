export interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  isActive: boolean;
  assignedProfessors: string[]; // Array of professor IDs
  createdBy: string; // Admin who created the subject
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface CreateSubjectRequest {
  code: string;
  title: string;
  description: string;
  credits: number;
  assignedProfessors?: string[]; // Optional initial assignments
}

export interface UpdateSubjectRequest {
  code?: string;
  title?: string;
  description?: string;
  credits?: number;
  isActive?: boolean;
  assignedProfessors?: string[];
}

export interface AssignSubjectRequest {
  professorIds: string[];
}

export interface SubjectAssignment {
  subjectId: string;
  professorId: string;
  assignedAt: {
    seconds: number;
    nanoseconds: number;
  };
  assignedBy: string; // Admin who made the assignment
}

export interface SubjectResponse {
  success: boolean;
  data?: {
    subject?: Subject;
    subjects?: Subject[];
    total?: number;
    page?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export interface SubjectsState {
  subjects: Subject[];
  currentSubject: Subject | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}
