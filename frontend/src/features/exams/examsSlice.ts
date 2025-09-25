import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '../../services/examService';
import { CreateExamRequest, UpdateExamRequest, SubmitExamRequest, GradeExamRequest, Exam, ExamSubmission } from '../../types/exam';

interface ExamsState {
  exams: Exam[];
  currentExam: Exam | null;
  submissions: ExamSubmission[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
}

const initialState: ExamsState = {
  exams: [],
  currentExam: null,
  submissions: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const createExam = createAsyncThunk(
  'exams/createExam',
  async (examData: CreateExamRequest, { rejectWithValue }) => {
    try {
      const response = await examService.createExam(examData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create exam');
    }
  }
);

export const fetchExamsByProfessor = createAsyncThunk(
  'exams/fetchExamsByProfessor',
  async (isActive?: boolean, { rejectWithValue }) => {
    try {
      const response = await examService.getExamsByProfessor(isActive);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch exams');
    }
  }
);

export const fetchExamsByBranch = createAsyncThunk(
  'exams/fetchExamsByBranch',
  async ({ branchId, isActive }: { branchId: string; isActive?: boolean }, { rejectWithValue }) => {
    try {
      const response = await examService.getExamsByBranch(branchId, isActive);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch exams');
    }
  }
);

export const fetchExamById = createAsyncThunk(
  'exams/fetchExamById',
  async (examId: string, { rejectWithValue }) => {
    try {
      const response = await examService.getExamById(examId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch exam');
    }
  }
);

export const updateExam = createAsyncThunk(
  'exams/updateExam',
  async ({ id, data }: { id: string; data: UpdateExamRequest }, { rejectWithValue }) => {
    try {
      const response = await examService.updateExam(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update exam');
    }
  }
);

export const deleteExam = createAsyncThunk(
  'exams/deleteExam',
  async (examId: string, { rejectWithValue }) => {
    try {
      await examService.deleteExam(examId);
      return examId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete exam');
    }
  }
);

export const submitExam = createAsyncThunk(
  'exams/submitExam',
  async ({ examId, data }: { examId: string; data: SubmitExamRequest }, { rejectWithValue }) => {
    try {
      const response = await examService.submitExam(examId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to submit exam');
    }
  }
);

export const fetchExamSubmissions = createAsyncThunk(
  'exams/fetchExamSubmissions',
  async ({ examId, studentId }: { examId: string; studentId?: string }, { rejectWithValue }) => {
    try {
      const response = await examService.getExamSubmissions(examId, studentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch submissions');
    }
  }
);

export const gradeExamSubmission = createAsyncThunk(
  'exams/gradeExamSubmission',
  async (data: GradeExamRequest, { rejectWithValue }) => {
    try {
      const response = await examService.gradeExamSubmission(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to grade exam');
    }
  }
);

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
    clearCurrentExam: (state) => {
      state.currentExam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Exam
      .addCase(createExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.exam) {
          state.exams.unshift(action.payload.exam);
        }
        state.error = null;
      })
      .addCase(createExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Exams by Professor
      .addCase(fetchExamsByProfessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamsByProfessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload?.exams || [];
        state.error = null;
      })
      .addCase(fetchExamsByProfessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Exams by Branch
      .addCase(fetchExamsByBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamsByBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = action.payload?.exams || [];
        state.error = null;
      })
      .addCase(fetchExamsByBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Exam by ID
      .addCase(fetchExamById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentExam = action.payload?.exam || null;
        state.error = null;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Exam
      .addCase(updateExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.exam) {
          const index = state.exams.findIndex(exam => exam.id === action.payload.exam.id);
          if (index !== -1) {
            state.exams[index] = action.payload.exam;
          }
          if (state.currentExam?.id === action.payload.exam.id) {
            state.currentExam = action.payload.exam;
          }
        }
        state.error = null;
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Exam
      .addCase(deleteExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exams = state.exams.filter(exam => exam.id !== action.payload);
        if (state.currentExam?.id === action.payload) {
          state.currentExam = null;
        }
        state.error = null;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Submit Exam
      .addCase(submitExam.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitExam.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.submission) {
          state.submissions.unshift(action.payload.submission);
        }
        state.error = null;
      })
      .addCase(submitExam.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Exam Submissions
      .addCase(fetchExamSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissions = action.payload?.submissions || [];
        state.error = null;
      })
      .addCase(fetchExamSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Grade Exam Submission
      .addCase(gradeExamSubmission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(gradeExamSubmission.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.submission) {
          const index = state.submissions.findIndex(sub => sub.id === action.payload.submission.id);
          if (index !== -1) {
            state.submissions[index] = action.payload.submission;
          }
        }
        state.error = null;
      })
      .addCase(gradeExamSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentExam, clearCurrentExam } = examsSlice.actions;
export const examsSliceReducer = examsSlice.reducer;
