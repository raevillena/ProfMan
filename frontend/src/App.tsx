import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './app/store'
import { AuthProvider } from './contexts/AuthProvider'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { FirebaseDemoPage } from './pages/FirebaseDemoPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminSubjectsPage from './pages/AdminSubjectsPage'
import ProfessorDashboardPage from './pages/ProfessorDashboardPage'
import ProfessorSubjectsPage from './pages/ProfessorSubjectsPage'
import ProfessorBranchesPage from './pages/ProfessorBranchesPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import QuizManagementPage from './pages/QuizManagementPage'
import ExamManagementPage from './pages/ExamManagementPage'
import { AdminLayout } from './layouts/AdminLayout'
import { ProfessorLayout } from './layouts/ProfessorLayout'
import { StudentLayout } from './layouts/StudentLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoadingSpinner } from './components/LoadingSpinner'

function App() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        
        {/* Firebase Demo route */}
        <Route 
          path="/firebase-demo" 
          element={<FirebaseDemoPage />} 
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? (
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              ) : user?.role === 'professor' ? (
                <ProfessorLayout>
                  <ProfessorDashboardPage />
                </ProfessorLayout>
              ) : (
                <StudentLayout>
                  <StudentDashboardPage />
                </StudentLayout>
              )}
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? (
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' ? (
                <AdminLayout>
                  <AdminSubjectsPage />
                </AdminLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        {/* Professor routes */}
        <Route
          path="/professor/subjects"
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? (
                <ProfessorLayout>
                  <ProfessorSubjectsPage />
                </ProfessorLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/professor/branches"
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? (
                <ProfessorLayout>
                  <ProfessorBranchesPage />
                </ProfessorLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/professor/quizzes"
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? (
                <ProfessorLayout>
                  <QuizManagementPage />
                </ProfessorLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/professor/exams"
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? (
                <ProfessorLayout>
                  <ExamManagementPage />
                </ProfessorLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/professor/drive"
          element={
            <ProtectedRoute>
              {user?.role === 'professor' ? (
                <ProfessorLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Drive Integration</h1>
                    <p className="text-gray-600">Google Drive integration coming soon...</p>
                  </div>
                </ProfessorLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
