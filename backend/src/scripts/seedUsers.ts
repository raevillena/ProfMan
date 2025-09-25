import { initializeFirebase, getFirestore } from '../utils/firebase'
import bcrypt from 'bcryptjs'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

interface UserData {
  email: string
  password: string
  displayName: string
  role: 'admin' | 'professor' | 'student'
  studentNumber?: string
}

const userSeeds: UserData[] = [
  // Admin users
  {
    email: 'admin@profman.com',
    password: 'admin123',
    displayName: 'Dr. Sarah Johnson',
    role: 'admin',
  },
  {
    email: 'admin2@profman.com',
    password: 'admin123',
    displayName: 'Dr. Robert Chen',
    role: 'admin',
  },
  
  // Professor users
  {
    email: 'prof.smith@university.edu',
    password: 'prof123',
    displayName: 'Prof. Michael Smith',
    role: 'professor',
  },
  {
    email: 'prof.davis@university.edu',
    password: 'prof123',
    displayName: 'Prof. Emily Davis',
    role: 'professor',
  },
  {
    email: 'prof.wilson@university.edu',
    password: 'prof123',
    displayName: 'Prof. David Wilson',
    role: 'professor',
  },
  {
    email: 'prof.garcia@university.edu',
    password: 'prof123',
    displayName: 'Prof. Maria Garcia',
    role: 'professor',
  },
  {
    email: 'prof.lee@university.edu',
    password: 'prof123',
    displayName: 'Prof. James Lee',
    role: 'professor',
  },
  
  // Student users
  {
    email: 'student1@university.edu',
    password: '12345',
    displayName: 'John Doe',
    role: 'student',
    studentNumber: '2024001',
  },
  {
    email: 'student2@university.edu',
    password: '67890',
    displayName: 'Jane Smith',
    role: 'student',
    studentNumber: '2024002',
  },
  {
    email: 'student3@university.edu',
    password: '11111',
    displayName: 'Alice Johnson',
    role: 'student',
    studentNumber: '2024003',
  },
  {
    email: 'student4@university.edu',
    password: '22222',
    displayName: 'Bob Brown',
    role: 'student',
    studentNumber: '2024004',
  },
  {
    email: 'student5@university.edu',
    password: '33333',
    displayName: 'Carol White',
    role: 'student',
    studentNumber: '2024005',
  },
  {
    email: 'student6@university.edu',
    password: '44444',
    displayName: 'David Miller',
    role: 'student',
    studentNumber: '2024006',
  },
  {
    email: 'student7@university.edu',
    password: '55555',
    displayName: 'Emma Wilson',
    role: 'student',
    studentNumber: '2024007',
  },
  {
    email: 'student8@university.edu',
    password: '66666',
    displayName: 'Frank Taylor',
    role: 'student',
    studentNumber: '2024008',
  },
  {
    email: 'student9@university.edu',
    password: '77777',
    displayName: 'Grace Anderson',
    role: 'student',
    studentNumber: '2024009',
  },
  {
    email: 'student10@university.edu',
    password: '88888',
    displayName: 'Henry Thomas',
    role: 'student',
    studentNumber: '2024010',
  },
]

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function seedUsers() {
  console.log('🌱 Seeding users...')
  
  let createdCount = 0
  let skippedCount = 0
  
  for (const userData of userSeeds) {
    try {
      // Check if user already exists
      const existingUser = await db.collection('users').where('email', '==', userData.email).get()
      
      if (!existingUser.empty) {
        console.log(`User ${userData.email} already exists, skipping...`)
        skippedCount++
        continue
      }

      // Hash password
      const passwordHash = await hashPassword(userData.password)
      
      // Create user document
      const userRef = db.collection('users').doc()
      const now = new Date()
      
      const user = {
        id: userRef.id,
        email: userData.email,
        passwordHash,
        displayName: userData.displayName,
        role: userData.role,
        studentNumber: userData.studentNumber,
        isActive: true,
        isDeleted: false,
        createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      }

      await userRef.set(user)
      console.log(`✅ Created user: ${userData.email} (${userData.role})`)
      createdCount++
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error)
    }
  }
  
  console.log(`\n📊 User seeding summary:`)
  console.log(`- Created: ${createdCount} users`)
  console.log(`- Skipped: ${skippedCount} users (already exist)`)
  console.log(`- Total processed: ${userSeeds.length} users`)
}

async function main() {
  try {
    console.log('🚀 Starting user seeding...')
    await seedUsers()
    console.log('✅ User seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ User seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
