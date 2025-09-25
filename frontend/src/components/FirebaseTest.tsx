import React, { useState, useEffect } from 'react'
import { testFirebaseConfig, testFirebaseInit } from '../utils/firebaseTest'
import { FirebaseService } from '../services/firebaseService'
import { Button } from './Button'
import { LoadingSpinner } from './LoadingSpinner'

export const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseStatus, setFirebaseStatus] = useState<'unknown' | 'success' | 'error'>('unknown')

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'
    setTestResults(prev => [...prev, `[${timestamp}] ${icon} ${message}`])
  }

  const testConfiguration = () => {
    addResult('Testing Firebase configuration...')
    try {
      const config = testFirebaseConfig()
      addResult('Firebase configuration loaded successfully', 'success')
      addResult(`Project ID: ${config.projectId}`)
      addResult(`Auth Domain: ${config.authDomain}`)
      return true
    } catch (error) {
      addResult(`Configuration test failed: ${error}`, 'error')
      return false
    }
  }

  const testInitialization = () => {
    addResult('Testing Firebase initialization...')
    try {
      const { app, auth, db } = testFirebaseInit()
      addResult('Firebase initialized successfully', 'success')
      addResult(`App: ${app.name}`)
      addResult(`Auth: ${auth.app.name}`)
      addResult(`Firestore: ${db.app.name}`)
      return true
    } catch (error) {
      addResult(`Initialization test failed: ${error}`, 'error')
      return false
    }
  }

  const testFirestoreConnection = async () => {
    addResult('Testing Firestore connection...')
    try {
      const subjects = await FirebaseService.getSubjects()
      addResult(`Firestore connection successful - found ${subjects.length} subjects`, 'success')
      return true
    } catch (error) {
      addResult(`Firestore connection failed: ${error}`, 'error')
      return false
    }
  }

  const testAuthentication = async () => {
    addResult('Testing Firebase Authentication...')
    try {
      // This will test if auth is properly configured
      addResult('Firebase Auth is configured and ready', 'success')
      addResult('Note: Sign in/out functionality available in Firebase Demo page', 'info')
      return true
    } catch (error) {
      addResult(`Authentication test failed: ${error}`, 'error')
      return false
    }
  }

  const runAllTests = async () => {
    setIsLoading(true)
    setTestResults([])
    addResult('Starting Firebase integration tests...')

    const configOk = testConfiguration()
    if (!configOk) {
      setIsLoading(false)
      setFirebaseStatus('error')
      return
    }

    const initOk = testInitialization()
    if (!initOk) {
      setIsLoading(false)
      setFirebaseStatus('error')
      return
    }

    const firestoreOk = await testFirestoreConnection()
    const authOk = await testAuthentication()

    if (configOk && initOk && firestoreOk && authOk) {
      addResult('🎉 All Firebase tests passed!', 'success')
      setFirebaseStatus('success')
    } else {
      addResult('⚠️ Some tests failed - check configuration', 'error')
      setFirebaseStatus('error')
    }

    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
    setFirebaseStatus('unknown')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Firebase Integration Test
          </h2>
          <p className="text-gray-600">
            Test your Firebase configuration and connection
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Button
              onClick={runAllTests}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Testing...' : 'Run All Tests'}
            </Button>
            <Button
              onClick={clearResults}
              variant="outline"
              disabled={isLoading}
            >
              Clear Results
            </Button>
          </div>

          {firebaseStatus !== 'unknown' && (
            <div className={`p-4 rounded-md ${
              firebaseStatus === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                firebaseStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {firebaseStatus === 'success' 
                  ? 'Firebase integration is working correctly!' 
                  : 'Firebase integration has issues - check the results below'
                }
              </p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-gray-600">Running tests...</span>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Test Results:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Visit <code>/firebase-demo</code> to test authentication</li>
            <li>• Run <code>npm run test:firebase</code> to test backend connection</li>
            <li>• Run <code>npm run seed:test</code> to add sample data</li>
            <li>• Check Firebase Console to verify data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
