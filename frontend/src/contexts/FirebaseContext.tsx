import React, { createContext, useContext, ReactNode } from 'react'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'
import { User as FirebaseUser } from 'firebase/auth'
import { User } from '../types/auth'

interface FirebaseContextType {
  user: FirebaseUser | null
  userData: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<FirebaseUser>
  signUp: (email: string, password: string, displayName: string) => Promise<FirebaseUser>
  signOut: () => Promise<void>
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined)

interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const firebaseAuth = useFirebaseAuth()

  return (
    <FirebaseContext.Provider value={firebaseAuth}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}
