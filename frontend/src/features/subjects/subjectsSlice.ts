import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subjectService } from '../../services/subjectService';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest, SubjectsState } from '../../types/subject';

const initialState: SubjectsState = {
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (params: { page?: number; limit?: number; isActive?: boolean; search?: string } = {}) => {
    const response = await subjectService.getSubjects(params);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch subjects');
    }
    return response.data!;
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchSubjectById',
  async (id: string) => {
    const response = await subjectService.getSubjectById(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch subject');
    }
    return response.data!.subject!;
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData: CreateSubjectRequest) => {
    const response = await subjectService.createSubject(subjectData);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create subject');
    }
    return response.data!.subject!;
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, updates }: { id: string; updates: UpdateSubjectRequest }) => {
    const response = await subjectService.updateSubject(id, updates);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update subject');
    }
    return response.data!.subject!;
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id: string) => {
    const response = await subjectService.deleteSubject(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete subject');
    }
    return id;
  }
);

export const restoreSubject = createAsyncThunk(
  'subjects/restoreSubject',
  async (id: string) => {
    const response = await subjectService.restoreSubject(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to restore subject');
    }
    return id;
  }
);

export const fetchActiveSubjects = createAsyncThunk(
  'subjects/fetchActiveSubjects',
  async () => {
    const response = await subjectService.getActiveSubjects();
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch active subjects');
    }
    return response.data!.subjects!;
  }
);

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSubject: (state, action: PayloadAction<Subject | null>) => {
      state.currentSubject = action.payload;
    },
    clearSubjects: (state) => {
      state.subjects = [];
      state.currentSubject = null;
      state.pagination = {
        page: 1,
        totalPages: 1,
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch subjects
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.subjects || [];
        state.pagination = {
          page: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subjects';
      });

    // Fetch subject by ID
    builder
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subject';
      });

    // Create subject
    builder
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create subject';
      });

    // Update subject
    builder
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex(subject => subject.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        if (state.currentSubject?.id === action.payload.id) {
          state.currentSubject = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update subject';
      });

    // Delete subject
    builder
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(subject => subject.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete subject';
      });

    // Restore subject
    builder
      .addCase(restoreSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreSubject.fulfilled, (state, action) => {
        state.loading = false;
        // Note: Restored subjects would need to be refetched to get updated data
      })
      .addCase(restoreSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to restore subject';
      });

    // Fetch active subjects
    builder
      .addCase(fetchActiveSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchActiveSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active subjects';
      });
  },
});

export const { clearError, setCurrentSubject, clearSubjects } = subjectsSlice.actions;
export const subjectsSliceReducer = subjectsSlice.reducer;