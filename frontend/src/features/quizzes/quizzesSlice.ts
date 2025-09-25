import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizService } from '../../services/quizService';
import { Quiz, CreateQuizRequest, UpdateQuizRequest, QuizAttempt, SubmitQuizAttemptRequest } from '../../types/quiz';

interface QuizzesState {
  quizzes: Quiz[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  currentQuiz: Quiz | null;
  attempts: QuizAttempt[];
}

const initialState: QuizzesState = {
  quizzes: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  error: null,
  currentQuiz: null,
  attempts: [],
};

// Async Thunks
export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    branchId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizzes(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quizzes/fetchQuizById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quizzes/createQuiz',
  async (quizData: CreateQuizRequest, { rejectWithValue }) => {
    try {
      const response = await quizService.createQuiz(quizData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quizzes/updateQuiz',
  async ({ id, updates }: { id: string; updates: UpdateQuizRequest }, { rejectWithValue }) => {
    try {
      const response = await quizService.updateQuiz(id, updates);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id: string, { rejectWithValue }) => {
    try {
      await quizService.deleteQuiz(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const submitQuizAttempt = createAsyncThunk(
  'quizzes/submitQuizAttempt',
  async (attemptData: SubmitQuizAttemptRequest, { rejectWithValue }) => {
    try {
      const response = await quizService.submitQuizAttempt(attemptData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const fetchQuizAttemptsByStudent = createAsyncThunk(
  'quizzes/fetchQuizAttemptsByStudent',
  async ({ studentId, quizId }: { studentId: string; quizId?: string }, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizAttemptsByStudent(studentId, quizId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.currentQuiz = action.payload;
    },
    setQuizzesPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setQuizzesLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<QuizzesResponse>) => {
        state.isLoading = false;
        state.quizzes = action.payload.quizzes;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizById.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        state.quizzes.push(action.payload);
        state.total++;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false;
        const index = state.quizzes.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?.id === action.payload.id) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
        state.total--;
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action: PayloadAction<QuizAttempt>) => {
        state.isLoading = false;
        state.attempts.push(action.payload);
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizAttemptsByStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizAttemptsByStudent.fulfilled, (state, action: PayloadAction<QuizAttempt[]>) => {
        state.isLoading = false;
        state.attempts = action.payload;
      })
      .addCase(fetchQuizAttemptsByStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentQuiz, setQuizzesPage, setQuizzesLimit } = quizzesSlice.actions;
export const quizzesSliceReducer = quizzesSlice.reducer;