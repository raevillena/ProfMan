import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { usersService } from '../../services/usersService'
import { User, CreateUserRequest, UpdateUserRequest } from '../../types/user'

interface UsersState {
  users: User[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page?: number; limit?: number; role?: string; includeDeleted?: boolean }, { rejectWithValue }) => {
    try {
      const response = await usersService.getUsers(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch users')
    }
  }
)

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await usersService.createUser(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create user')
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: string; userData: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await usersService.updateUser(id, userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update user')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ id, force = false }: { id: string; force?: boolean }, { rejectWithValue }) => {
    try {
      await usersService.deleteUser(id, force)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete user')
    }
  }
)

export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await usersService.restoreUser(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to restore user')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
      state.pagination.page = action.payload.page
      state.pagination.limit = action.payload.limit
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.users
        state.pagination = action.payload.pagination
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users.unshift(action.payload.user)
        state.pagination.total += 1
        state.error = null
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.users.findIndex(user => user.id === action.payload.user.id)
        if (index !== -1) {
          state.users[index] = action.payload.user
        }
        state.error = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        state.pagination.total -= 1
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Restore User
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.users.findIndex(user => user.id === action.payload.user.id)
        if (index !== -1) {
          state.users[index] = action.payload.user
        }
        state.error = null
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setPagination } = usersSlice.actions
export const usersSliceReducer = usersSlice.reducer
