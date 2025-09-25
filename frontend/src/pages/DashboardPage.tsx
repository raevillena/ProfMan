import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { fetchUsers } from '../features/users/usersSlice'
import { fetchSubjects } from '../features/subjects/subjectsSlice'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { users, loading: usersLoading } = useAppSelector((state) => state.users)
  const { subjects, loading: subjectsLoading } = useAppSelector((state) => state.subjects)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.role === 'admin') {
        setIsLoading(true)
        try {
          await Promise.all([
            dispatch(fetchUsers({ page: 1, limit: 1000 })),
            dispatch(fetchSubjects({ page: 1, limit: 1000 }))
          ])
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [dispatch, user?.role])

  // Calculate statistics
  const totalUsers = users.length
  const professors = users.filter(u => u.role === 'professor').length
  const students = users.filter(u => u.role === 'student').length
  const totalSubjects = subjects.length

  const getDashboardContent = () => {
    if (!user) return null

    switch (user.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage users, subjects, and system settings
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Users
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {isLoading ? <LoadingSpinner size="sm" /> : totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">P</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Professors
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {isLoading ? <LoadingSpinner size="sm" /> : professors}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">S</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Students
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {isLoading ? <LoadingSpinner size="sm" /> : students}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-sm font-medium">C</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Subjects
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {isLoading ? <LoadingSpinner size="sm" /> : totalSubjects}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )

      case 'professor':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professor Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your subjects, classes, and student progress
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Classes</h3>
                <p className="text-gray-500">No classes yet. Create your first class to get started.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-500">No recent activity.</p>
              </motion.div>
            </div>
          </div>
        )

      case 'student':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                View your classes, assignments, and grades
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">My Classes</h3>
                <p className="text-gray-500">You are not enrolled in any classes yet.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Assignments</h3>
                <p className="text-gray-500">No upcoming assignments.</p>
              </motion.div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading && user?.role === 'admin') {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {getDashboardContent()}
    </div>
  )
}
