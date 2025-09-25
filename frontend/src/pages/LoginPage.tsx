import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { login, clearError } from '../features/auth/authSlice'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { LoadingSpinner } from '../components/LoadingSpinner'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isLoading, error, requiresPasswordChange } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  useEffect(() => {
    if (requiresPasswordChange) {
      navigate('/change-password')
    }
  }, [requiresPasswordChange, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    dispatch(clearError())
    dispatch(login(formData))
  }

  const handleTestUserLogin = (email: string, password: string) => {
    setFormData({ email, password })
    dispatch(clearError())
    dispatch(login({ email, password }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ProfMan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Professor Management System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={formErrors.password}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-md p-4"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              For students: Use your institutional email and student number as password
            </p>
          </div>
        </form>

        {/* Test Users Section */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Test Users</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Click any button below to login with test credentials
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={() => handleTestUserLogin('test@profman.com', 'test123')}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <div className="text-left">
                    <div className="font-medium">Admin User</div>
                    <div className="text-xs text-gray-500">test@profman.com</div>
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={() => handleTestUserLogin('prof@example.com', 'password123')}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="text-left">
                    <div className="font-medium">Professor User</div>
                    <div className="text-xs text-gray-500">prof@example.com</div>
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={() => handleTestUserLogin('student@university.edu', '2024001')}
                disabled={isLoading}
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="text-left">
                    <div className="font-medium">Student User</div>
                    <div className="text-xs text-gray-500">student@university.edu</div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Professor and Student users need to be created first through the Admin panel. 
                The Admin user (test@profman.com) is available for testing.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
