export interface WeekContent {
  weekNumber: number;
  title: string;
  description: string;
  resources: {
    type: 'video' | 'document' | 'link' | 'quiz' | 'assignment';
    title: string;
    url?: string;
    fileId?: string;
    description?: string;
  }[];
  assignments: {
    title: string;
    description: string;
    dueDate: {
      seconds: number;
      nanoseconds: number;
    };
    points: number;
    type: 'quiz' | 'exam' | 'assignment' | 'project';
  }[];
}

export interface Branch {
  id: string;
  subjectId: string;
  professorId: string;
  title: string;
  description: string;
  weekStructure: WeekContent[];
  isActive: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface CreateBranchRequest {
  subjectId: string;
  professorId: string;
  title: string;
  description: string;
  weekStructure: WeekContent[];
}

export interface UpdateBranchRequest {
  title?: string;
  description?: string;
  weekStructure?: WeekContent[];
  isActive?: boolean;
}

export interface CloneBranchRequest {
  professorId: string;
  title: string;
}

export interface BranchResponse {
  success: boolean;
  data?: {
    branch?: Branch;
    branches?: Branch[];
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

export interface BranchesState {
  branches: Branch[];
  currentBranch: Branch | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}
