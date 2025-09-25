import { configureStore } from '@reduxjs/toolkit'
import { authSliceReducer } from '../features/auth/authSlice'
import { usersSliceReducer } from '../features/users/usersSlice'
import { subjectsSliceReducer } from '../features/subjects/subjectsSlice'
import { branchesSliceReducer } from '../features/branches/branchesSlice'
import { quizzesSliceReducer } from '../features/quizzes/quizzesSlice'
import { examsSliceReducer } from '../features/exams/examsSlice'

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    users: usersSliceReducer,
    subjects: subjectsSliceReducer,
    branches: branchesSliceReducer,
    quizzes: quizzesSliceReducer,
    exams: examsSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
