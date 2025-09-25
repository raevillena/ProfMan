import { initializeFirebase, getFirestore } from '../utils/firebase'
import bcrypt from 'bcryptjs'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

// Mock data generators
const mockData = {
  // User data
  users: [
    {
      email: 'admin@profman.com',
      password: 'admin123',
      displayName: 'Dr. Sarah Johnson',
      role: 'admin' as const,
    },
    {
      email: 'prof.smith@university.edu',
      password: 'prof123',
      displayName: 'Prof. Michael Smith',
      role: 'professor' as const,
    },
    {
      email: 'prof.davis@university.edu',
      password: 'prof123',
      displayName: 'Prof. Emily Davis',
      role: 'professor' as const,
    },
    {
      email: 'prof.wilson@university.edu',
      password: 'prof123',
      displayName: 'Prof. David Wilson',
      role: 'professor' as const,
    },
    {
      email: 'student1@university.edu',
      password: '12345',
      displayName: 'John Doe',
      role: 'student' as const,
      studentNumber: '2024001',
    },
    {
      email: 'student2@university.edu',
      password: '67890',
      displayName: 'Jane Smith',
      role: 'student' as const,
      studentNumber: '2024002',
    },
    {
      email: 'student3@university.edu',
      password: '11111',
      displayName: 'Alice Johnson',
      role: 'student' as const,
      studentNumber: '2024003',
    },
    {
      email: 'student4@university.edu',
      password: '22222',
      displayName: 'Bob Brown',
      role: 'student' as const,
      studentNumber: '2024004',
    },
    {
      email: 'student5@university.edu',
      password: '33333',
      displayName: 'Carol White',
      role: 'student' as const,
      studentNumber: '2024005',
    },
  ],

  // Subject data
  subjects: [
    {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      description: 'Basic concepts of computer science, programming fundamentals, and problem-solving techniques.',
      isReusable: true,
    },
    {
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      description: 'Study of fundamental data structures and algorithm design techniques.',
      isReusable: true,
    },
    {
      code: 'CS301',
      title: 'Database Systems',
      description: 'Introduction to database design, SQL, and database management systems.',
      isReusable: true,
    },
    {
      code: 'MATH201',
      title: 'Calculus I',
      description: 'Differential and integral calculus of single variable functions.',
      isReusable: true,
    },
    {
      code: 'MATH202',
      title: 'Calculus II',
      description: 'Advanced calculus topics including integration techniques and series.',
      isReusable: true,
    },
    {
      code: 'PHYS101',
      title: 'General Physics I',
      description: 'Mechanics, thermodynamics, and wave motion.',
      isReusable: true,
    },
    {
      code: 'ENG101',
      title: 'Technical Writing',
      description: 'Professional writing skills for technical communication.',
      isReusable: true,
    },
  ],

  // Week content templates
  weekContents: {
    CS101: [
      { week: 1, title: 'Introduction to Programming', type: 'lecture' as const },
      { week: 2, title: 'Variables and Data Types', type: 'lecture' as const },
      { week: 3, title: 'Control Structures', type: 'lecture' as const },
      { week: 4, title: 'Functions and Modules', type: 'lecture' as const },
      { week: 5, title: 'Midterm Quiz', type: 'quiz' as const },
      { week: 6, title: 'Object-Oriented Programming', type: 'lecture' as const },
      { week: 7, title: 'Arrays and Lists', type: 'lecture' as const },
      { week: 8, title: 'File I/O', type: 'lecture' as const },
      { week: 9, title: 'Error Handling', type: 'lecture' as const },
      { week: 10, title: 'Final Project', type: 'exam' as const },
    ],
    CS201: [
      { week: 1, title: 'Introduction to Data Structures', type: 'lecture' as const },
      { week: 2, title: 'Arrays and Linked Lists', type: 'lecture' as const },
      { week: 3, title: 'Stacks and Queues', type: 'lecture' as const },
      { week: 4, title: 'Trees and Binary Trees', type: 'lecture' as const },
      { week: 5, title: 'Tree Traversal Quiz', type: 'quiz' as const },
      { week: 6, title: 'Binary Search Trees', type: 'lecture' as const },
      { week: 7, title: 'Hash Tables', type: 'lecture' as const },
      { week: 8, title: 'Graphs', type: 'lecture' as const },
      { week: 9, title: 'Sorting Algorithms', type: 'lecture' as const },
      { week: 10, title: 'Searching Algorithms', type: 'lecture' as const },
      { week: 11, title: 'Algorithm Analysis', type: 'lecture' as const },
      { week: 12, title: 'Final Exam', type: 'exam' as const },
    ],
  },

  // Quiz questions templates
  quizQuestions: {
    CS101: [
      {
        type: 'mcq' as const,
        question: 'What is the correct syntax to declare a variable in Python?',
        options: ['var x = 5', 'x = 5', 'int x = 5', 'variable x = 5'],
        correctAnswer: 'x = 5',
        points: 10,
      },
      {
        type: 'mcq' as const,
        question: 'Which of the following is NOT a Python data type?',
        options: ['int', 'float', 'string', 'character'],
        correctAnswer: 'character',
        points: 10,
      },
      {
        type: 'multi' as const,
        question: 'Which of the following are control structures in Python?',
        options: ['if', 'for', 'while', 'switch'],
        correctAnswer: ['if', 'for', 'while'],
        points: 15,
        partialCredit: true,
      },
      {
        type: 'numeric' as const,
        question: 'What is the result of 2 + 3 * 4?',
        correctAnswer: 14,
        points: 10,
        tolerance: 0.1,
      },
      {
        type: 'short-text' as const,
        question: 'What keyword is used to define a function in Python?',
        correctAnswer: 'def',
        points: 10,
      },
    ],
    CS201: [
      {
        type: 'mcq' as const,
        question: 'What is the time complexity of accessing an element in an array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 'O(1)',
        points: 10,
      },
      {
        type: 'mcq' as const,
        question: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 'Stack',
        points: 10,
      },
      {
        type: 'multi' as const,
        question: 'Which of the following are types of tree traversal?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Sideorder'],
        correctAnswer: ['Inorder', 'Preorder', 'Postorder'],
        points: 15,
        partialCredit: true,
      },
      {
        type: 'numeric' as const,
        question: 'What is the height of a binary tree with 7 nodes?',
        correctAnswer: 3,
        points: 10,
        tolerance: 0.1,
      },
    ],
  },

  // Announcements
  announcements: [
    {
      message: 'Welcome to CS101! Please review the syllabus and course materials.',
      audience: 'all',
    },
    {
      message: 'Midterm exam will be held next week. Study materials are available in the resources section.',
      audience: 'all',
    },
    {
      message: 'Assignment 3 deadline has been extended to Friday at 11:59 PM.',
      audience: 'all',
    },
    {
      message: 'Office hours are now available on Tuesdays and Thursdays from 2-4 PM.',
      audience: 'all',
    },
  ],
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

async function seedUsers() {
  console.log('🌱 Seeding users...')
  
  for (const userData of mockData.users) {
    try {
      // Check if user already exists
      const existingUser = await db.collection('users').where('email', '==', userData.email).get()
      
      if (!existingUser.empty) {
        console.log(`User ${userData.email} already exists, skipping...`)
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
      console.log(`✅ Created user: ${userData.email}`)
    } catch (error) {
      console.error(`❌ Error creating user ${userData.email}:`, error)
    }
  }
}

async function seedSubjects() {
  console.log('🌱 Seeding subjects...')
  
  // Get professor users
  const professorQuery = await db.collection('users').where('role', '==', 'professor').get()
  if (professorQuery.empty) {
    console.log('❌ No professor users found, skipping subjects...')
    return
  }
  
  const professorIds = professorQuery.docs.map(doc => doc.id)
  
  for (const subjectData of mockData.subjects) {
    try {
      // Check if subject already exists
      const existingSubject = await db.collection('subjects').where('code', '==', subjectData.code).get()
      
      if (!existingSubject.empty) {
        console.log(`Subject ${subjectData.code} already exists, skipping...`)
        continue
      }

      const subjectRef = db.collection('subjects').doc()
      const now = new Date()
      
      // Assign to random professor
      const randomProfessorId = professorIds[Math.floor(Math.random() * professorIds.length)]
      
      const subject = {
        id: subjectRef.id,
        ...subjectData,
        createdBy: randomProfessorId,
        createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      }

      await subjectRef.set(subject)
      console.log(`✅ Created subject: ${subjectData.code} (assigned to professor ${randomProfessorId})`)
    } catch (error) {
      console.error(`❌ Error creating subject ${subjectData.code}:`, error)
    }
  }
}

async function seedBranches() {
  console.log('🌱 Seeding branches...')
  
  // Get subjects and professors
  const subjectsQuery = await db.collection('subjects').get()
  const professorsQuery = await db.collection('users').where('role', '==', 'professor').get()
  const studentsQuery = await db.collection('users').where('role', '==', 'student').get()
  
  if (subjectsQuery.empty || professorsQuery.empty || studentsQuery.empty) {
    console.log('❌ Missing required data for branches, skipping...')
    return
  }
  
  const subjects = subjectsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  const professors = professorsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  const students = studentsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Create branches for each subject
  for (const subject of subjects) {
    try {
      // Check if branch already exists for this subject
      const existingBranch = await db.collection('branches').where('subjectId', '==', subject.id).get()
      
      if (!existingBranch.empty) {
        console.log(`Branch for subject ${subject.code} already exists, skipping...`)
        continue
      }

      // Assign to random professor
      const randomProfessor = professors[Math.floor(Math.random() * professors.length)]
      
      // Enroll random students (2-4 students per branch)
      const numStudents = Math.floor(Math.random() * 3) + 2
      const enrolledStudents = students
        .sort(() => 0.5 - Math.random())
        .slice(0, numStudents)
        .map(student => student.id)
      
      // Create week structure based on subject
      const weekContents = mockData.weekContents[subject.code as keyof typeof mockData.weekContents] || []
      const weekStructure = weekContents.map(week => ({
        weekNumber: week.week,
        title: week.title,
        description: `Content for ${week.title}`,
        contents: [
          {
            type: week.type,
            title: week.title,
            description: `Description for ${week.title}`,
            isRequired: true,
            points: week.type === 'quiz' ? 100 : week.type === 'exam' ? 200 : 0,
            dueDate: week.type === 'quiz' || week.type === 'exam' 
              ? { seconds: Math.floor((Date.now() + (week.week * 7 * 24 * 60 * 60 * 1000)) / 1000), nanoseconds: 0 } as any
              : undefined,
          }
        ]
      }))
      
      const branchRef = db.collection('branches').doc()
      const now = new Date()
      
      const branch = {
        id: branchRef.id,
        subjectId: subject.id,
        professorId: randomProfessor.id,
        title: `${subject.title} - ${randomProfessor.displayName} - Fall 2024`,
        description: `This is a branch of ${subject.title} taught by ${randomProfessor.displayName}`,
        weekStructure,
        students: enrolledStudents,
        createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      }

      await branchRef.set(branch)
      console.log(`✅ Created branch: ${branch.title} (${enrolledStudents.length} students enrolled)`)
    } catch (error) {
      console.error(`❌ Error creating branch for subject ${subject.code}:`, error)
    }
  }
}

async function seedQuizzes() {
  console.log('🌱 Seeding quizzes...')
  
  // Get branches
  const branchesQuery = await db.collection('branches').get()
  if (branchesQuery.empty) {
    console.log('❌ No branches found, skipping quizzes...')
    return
  }
  
  const branches = branchesQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  for (const branch of branches) {
    try {
      // Get subject code for quiz questions
      const subjectDoc = await db.collection('subjects').doc(branch.subjectId).get()
      if (!subjectDoc.exists) continue
      
      const subject = subjectDoc.data()
      const subjectCode = subject?.code
      
      // Get quiz questions for this subject
      const questions = mockData.quizQuestions[subjectCode as keyof typeof mockData.quizQuestions] || []
      
      if (questions.length === 0) continue
      
      // Create 2-3 quizzes per branch
      const numQuizzes = Math.floor(Math.random() * 2) + 2
      
      for (let i = 0; i < numQuizzes; i++) {
        const quizRef = db.collection('quizzes').doc()
        const now = new Date()
        
        // Select random questions for this quiz
        const quizQuestions = questions
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(questions.length, 3 + Math.floor(Math.random() * 3)))
          .map((q, index) => ({ ...q, id: `q${index + 1}` }))
        
        const totalPoints = quizQuestions.reduce((sum, q) => sum + q.points, 0)
        
        const quiz = {
          id: quizRef.id,
          branchId: branch.id,
          weekNumber: i + 1,
          title: `Quiz ${i + 1}: ${subject?.title}`,
          description: `Quiz covering topics from week ${i + 1}`,
          questions: quizQuestions,
          timeLimit: 30, // 30 minutes
          autoGrade: true,
          totalPoints,
          isActive: true,
          createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
          updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        }

        await quizRef.set(quiz)
        console.log(`✅ Created quiz: ${quiz.title} (${quizQuestions.length} questions)`)
      }
    } catch (error) {
      console.error(`❌ Error creating quizzes for branch ${branch.id}:`, error)
    }
  }
}

async function seedQuizAttempts() {
  console.log('🌱 Seeding quiz attempts...')
  
  // Get quizzes and students
  const quizzesQuery = await db.collection('quizzes').get()
  const studentsQuery = await db.collection('users').where('role', '==', 'student').get()
  
  if (quizzesQuery.empty || studentsQuery.empty) {
    console.log('❌ No quizzes or students found, skipping quiz attempts...')
    return
  }
  
  const quizzes = quizzesQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  const students = studentsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  for (const quiz of quizzes) {
    try {
      // Get branch to check student enrollment
      const branchDoc = await db.collection('branches').doc(quiz.branchId).get()
      if (!branchDoc.exists) continue
      
      const branch = branchDoc.data()
      const enrolledStudents = branch?.students || []
      
      // Create attempts for enrolled students
      for (const studentId of enrolledStudents) {
        const student = students.find(s => s.id === studentId)
        if (!student) continue
        
        // Check if attempt already exists
        const existingAttempt = await db.collection('quizAttempts')
          .where('quizId', '==', quiz.id)
          .where('studentId', '==', studentId)
          .get()
        
        if (!existingAttempt.empty) continue
        
        // Generate random answers
        const answers: Record<string, any> = {}
        for (const question of quiz.questions) {
          switch (question.type) {
            case 'mcq':
              answers[question.id] = question.options[Math.floor(Math.random() * question.options.length)]
              break
            case 'multi':
              const numSelections = Math.floor(Math.random() * question.options.length) + 1
              answers[question.id] = question.options
                .sort(() => 0.5 - Math.random())
                .slice(0, numSelections)
              break
            case 'numeric':
              const correctAnswer = parseFloat(question.correctAnswer)
              const tolerance = question.tolerance || 0.1
              const randomAnswer = correctAnswer + (Math.random() - 0.5) * tolerance * 2
              answers[question.id] = randomAnswer
              break
            case 'short-text':
              answers[question.id] = question.correctAnswer + (Math.random() > 0.7 ? ' extra' : '')
              break
          }
        }
        
        // Calculate score (simplified - in real app, use the auto-grading service)
        const score = Math.floor(Math.random() * quiz.totalPoints * 0.8) + (quiz.totalPoints * 0.2)
        const percentage = (score / quiz.totalPoints) * 100
        
        const attemptRef = db.collection('quizAttempts').doc()
        const now = new Date()
        
        const attempt = {
          id: attemptRef.id,
          quizId: quiz.id,
          studentId,
          answers,
          score,
          totalPoints: quiz.totalPoints,
          percentage,
          autoGraded: true,
          submittedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        }

        await attemptRef.set(attempt)
        console.log(`✅ Created quiz attempt for student ${student.displayName} (${percentage.toFixed(1)}%)`)
      }
    } catch (error) {
      console.error(`❌ Error creating quiz attempts for quiz ${quiz.id}:`, error)
    }
  }
}

async function seedAnnouncements() {
  console.log('🌱 Seeding announcements...')
  
  // Get branches
  const branchesQuery = await db.collection('branches').get()
  if (branchesQuery.empty) {
    console.log('❌ No branches found, skipping announcements...')
    return
  }
  
  const branches = branchesQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  for (const branch of branches) {
    try {
      // Create 2-3 announcements per branch
      const numAnnouncements = Math.floor(Math.random() * 2) + 2
      
      for (let i = 0; i < numAnnouncements; i++) {
        const announcementRef = db.collection('announcements').doc()
        const now = new Date()
        
        const randomAnnouncement = mockData.announcements[Math.floor(Math.random() * mockData.announcements.length)]
        
        const announcement = {
          id: announcementRef.id,
          branchId: branch.id,
          message: randomAnnouncement.message,
          createdBy: branch.professorId,
          audience: 'all',
          createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        }

        await announcementRef.set(announcement)
        console.log(`✅ Created announcement for branch ${branch.title}`)
      }
    } catch (error) {
      console.error(`❌ Error creating announcements for branch ${branch.id}:`, error)
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive database seeding...')
    
    await seedUsers()
    await seedSubjects()
    await seedBranches()
    await seedQuizzes()
    await seedQuizAttempts()
    await seedAnnouncements()
    
    console.log('\n✅ Database seeding completed successfully!')
    console.log('\n📋 Sample accounts created:')
    console.log('Admin: admin@profman.com / admin123')
    console.log('Professors: prof.smith@university.edu, prof.davis@university.edu, prof.wilson@university.edu / prof123')
    console.log('Students: student1@university.edu, student2@university.edu, etc. / student numbers')
    
    console.log('\n📚 Sample data created:')
    console.log('- 7 subjects with different topics')
    console.log('- Multiple branches with enrolled students')
    console.log('- Quizzes with various question types')
    console.log('- Quiz attempts with realistic scores')
    console.log('- Announcements for each branch')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
