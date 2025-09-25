import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../utils/firebase'
import { User } from '../types/auth'

export class FirebaseService {
  // Authentication methods
  static async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Firebase sign in error:', error)
      throw error
    }
  }

  static async signUpWithEmail(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })
      return userCredential.user
    } catch (error) {
      console.error('Firebase sign up error:', error)
      throw error
    }
  }

  static async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Firebase sign out error:', error)
      throw error
    }
  }

  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  // Firestore methods
  static async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as User
      }
      return null
    } catch (error) {
      console.error('Error getting user data:', error)
      throw error
    }
  }

  static async createUserData(userData: Omit<User, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating user data:', error)
      throw error
    }
  }

  static async updateUserData(userId: string, userData: Partial<User>) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error('Error updating user data:', error)
      throw error
    }
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', role))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User))
    } catch (error) {
      console.error('Error getting users by role:', error)
      throw error
    }
  }

  static async getSubjects(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'subjects'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting subjects:', error)
      throw error
    }
  }

  static async getBranches(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'branches'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting branches:', error)
      throw error
    }
  }

  static async getQuizzes(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting quizzes:', error)
      throw error
    }
  }

  static async getQuizAttempts(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizAttempts'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting quiz attempts:', error)
      throw error
    }
  }

  static async getAnnouncements(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'announcements'))
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error getting announcements:', error)
      throw error
    }
  }
}
