import React, { useState } from 'react'
import { useFirebase } from '../contexts/FirebaseContext'
import { Button } from './Button'
import { Input } from './Input'

interface FirebaseAuthProps {
  onAuthSuccess?: (user: any) => void
}

export const FirebaseAuth: React.FC<FirebaseAuthProps> = ({ onAuthSuccess }) => {
  const { signIn, signUp, signOut, user, loading } = useFirebase()
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  })
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password, formData.displayName)
      } else {
        await signIn(formData.email, formData.password)
      }
      
      if (onAuthSuccess) {
        onAuthSuccess(user)
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error: any) {
      setError(error.message || 'Sign out failed')
    }
  }

  if (user) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Welcome, {user.displayName || user.email}!
          </h3>
          <p className="text-sm text-gray-600">
            You are signed in with Firebase
          </p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          {isSignUp ? 'Sign Up with Firebase' : 'Sign In with Firebase'}
        </h3>
        <p className="text-sm text-gray-600">
          {isSignUp ? 'Create a new account' : 'Sign in to your account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <Input
            label="Display Name"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Enter your display name"
            required
          />
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          {isSignUp 
            ? 'Already have an account? Sign in' 
            : "Don't have an account? Sign up"
          }
        </button>
      </div>
    </div>
  )
}
