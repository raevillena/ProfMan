import React, { useState, useEffect } from 'react'
import { useFirebase } from '../contexts/FirebaseContext'
import { FirebaseService } from '../services/firebaseService'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { FirebaseTest } from '../components/FirebaseTest'

export const FirebaseDemoPage: React.FC = () => {
  const { user, userData, loading } = useFirebase()
  const [data, setData] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(false)

  const loadFirestoreData = async () => {
    setLoadingData(true)
    try {
      const [subjects, branches, quizzes, announcements] = await Promise.all([
        FirebaseService.getSubjects(),
        FirebaseService.getBranches(),
        FirebaseService.getQuizzes(),
        FirebaseService.getAnnouncements(),
      ])

      setData({
        subjects,
        branches,
        quizzes,
        announcements,
      })
    } catch (error) {
      console.error('Error loading Firestore data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadFirestoreData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Firebase Integration Demo</h1>
          <p className="mt-2 text-lg text-gray-600">
            This page demonstrates Firebase Authentication and Firestore integration
          </p>
        </div>

        {/* Firebase Test Component */}
        <div className="mb-8">
          <FirebaseTest />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Authentication Status
            </h2>
            
            {user ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-green-800">Signed In</h3>
                  <p className="text-sm text-green-700 mt-1">
                    User: {user.email}
                  </p>
                  <p className="text-sm text-green-700">
                    Display Name: {user.displayName || 'Not set'}
                  </p>
                  <p className="text-sm text-green-700">
                    UID: {user.uid}
                  </p>
                </div>

                {userData && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-800">User Data from Firestore</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Role: {userData.role}
                    </p>
                    <p className="text-sm text-blue-700">
                      Student Number: {userData.studentNumber || 'N/A'}
                    </p>
                    <p className="text-sm text-blue-700">
                      Active: {userData.isActive ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800">Not Signed In</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please sign in to see your data
                </p>
              </div>
            )}
          </div>

          {/* Firestore Data */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Firestore Data
            </h2>
            
            <div className="space-y-4">
              <Button
                onClick={loadFirestoreData}
                disabled={loadingData}
                className="w-full"
              >
                {loadingData ? 'Loading...' : 'Load Firestore Data'}
              </Button>

              {data && (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-900">Subjects</h4>
                    <p className="text-sm text-gray-600">{data.subjects.length} subjects found</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-900">Branches</h4>
                    <p className="text-sm text-gray-600">{data.branches.length} branches found</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-900">Quizzes</h4>
                    <p className="text-sm text-gray-600">{data.quizzes.length} quizzes found</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-900">Announcements</h4>
                    <p className="text-sm text-gray-600">{data.announcements.length} announcements found</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sample Data Display */}
        {data && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sample Data
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.subjects.slice(0, 4).map((subject: any) => (
                <div key={subject.id} className="bg-gray-50 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-900">{subject.code}</h4>
                  <p className="text-sm text-gray-600">{subject.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
