import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { branchService } from '../../services/branchService';
import { Branch, CreateBranchRequest, UpdateBranchRequest, CloneBranchRequest, BranchesState } from '../../types/branch';

const initialState: BranchesState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
};

// Async thunks
export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (params: { 
    page?: number; 
    limit?: number; 
    subjectId?: string;
    professorId?: string;
    isActive?: boolean; 
    search?: string; 
  } = {}) => {
    const response = await branchService.getBranches(params);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch branches');
    }
    return response.data!;
  }
);

export const fetchBranchById = createAsyncThunk(
  'branches/fetchBranchById',
  async (id: string) => {
    const response = await branchService.getBranchById(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch branch');
    }
    return response.data!.branch!;
  }
);

export const createBranch = createAsyncThunk(
  'branches/createBranch',
  async (branchData: CreateBranchRequest) => {
    const response = await branchService.createBranch(branchData);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create branch');
    }
    return response.data!.branch!;
  }
);

export const updateBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ id, updates }: { id: string; updates: UpdateBranchRequest }) => {
    const response = await branchService.updateBranch(id, updates);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update branch');
    }
    return response.data!.branch!;
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/deleteBranch',
  async (id: string) => {
    const response = await branchService.deleteBranch(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete branch');
    }
    return id;
  }
);

export const restoreBranch = createAsyncThunk(
  'branches/restoreBranch',
  async (id: string) => {
    const response = await branchService.restoreBranch(id);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to restore branch');
    }
    return id;
  }
);

export const fetchActiveBranches = createAsyncThunk(
  'branches/fetchActiveBranches',
  async () => {
    const response = await branchService.getActiveBranches();
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch active branches');
    }
    return response.data!.branches!;
  }
);

export const fetchBranchesByProfessor = createAsyncThunk(
  'branches/fetchBranchesByProfessor',
  async (professorId: string) => {
    const response = await branchService.getBranchesByProfessor(professorId);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch branches by professor');
    }
    return response.data!.branches!;
  }
);

export const fetchBranchesBySubject = createAsyncThunk(
  'branches/fetchBranchesBySubject',
  async (subjectId: string) => {
    const response = await branchService.getBranchesBySubject(subjectId);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch branches by subject');
    }
    return response.data!.branches!;
  }
);

export const cloneBranch = createAsyncThunk(
  'branches/cloneBranch',
  async ({ id, cloneData }: { id: string; cloneData: CloneBranchRequest }) => {
    const response = await branchService.cloneBranch(id, cloneData);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to clone branch');
    }
    return response.data!.branch!;
  }
);

const branchesSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBranch: (state, action: PayloadAction<Branch | null>) => {
      state.currentBranch = action.payload;
    },
    clearBranches: (state) => {
      state.branches = [];
      state.currentBranch = null;
      state.pagination = {
        page: 1,
        totalPages: 1,
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch branches
    builder
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload.branches || [];
        state.pagination = {
          page: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          total: action.payload.total || 0,
        };
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branches';
      });

    // Fetch branch by ID
    builder
      .addCase(fetchBranchById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branch';
      });

    // Create branch
    builder
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create branch';
      });

    // Update branch
    builder
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.branches.findIndex(branch => branch.id === action.payload.id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        if (state.currentBranch?.id === action.payload.id) {
          state.currentBranch = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update branch';
      });

    // Delete branch
    builder
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.filter(branch => branch.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete branch';
      });

    // Restore branch
    builder
      .addCase(restoreBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreBranch.fulfilled, (state, action) => {
        state.loading = false;
        // Note: Restored branches would need to be refetched to get updated data
      })
      .addCase(restoreBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to restore branch';
      });

    // Fetch active branches
    builder
      .addCase(fetchActiveBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchActiveBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch active branches';
      });

    // Fetch branches by professor
    builder
      .addCase(fetchBranchesByProfessor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchesByProfessor.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranchesByProfessor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branches by professor';
      });

    // Fetch branches by subject
    builder
      .addCase(fetchBranchesBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchesBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranchesBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branches by subject';
      });

    // Clone branch
    builder
      .addCase(cloneBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(cloneBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clone branch';
      });
  },
});

export const { clearError, setCurrentBranch, clearBranches } = branchesSlice.actions;
export const branchesSliceReducer = branchesSlice.reducer;