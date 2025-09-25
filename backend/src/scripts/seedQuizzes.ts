import { initializeFirebase, getFirestore } from '../utils/firebase'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

interface QuizQuestion {
  id: string
  type: 'mcq' | 'multi' | 'numeric' | 'short-text'
  question: string
  options?: string[]
  correctAnswer: string | string[] | number
  points: number
  tolerance?: number
  partialCredit?: boolean
}

// Question templates for different subjects
const questionTemplates: Record<string, Omit<QuizQuestion, 'id'>[]> = {
  'CS101': [
    {
      type: 'mcq',
      question: 'What is the correct syntax to declare a variable in Python?',
      options: ['var x = 5', 'x = 5', 'int x = 5', 'variable x = 5'],
      correctAnswer: 'x = 5',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'Which of the following is NOT a Python data type?',
      options: ['int', 'float', 'string', 'character'],
      correctAnswer: 'character',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'What is the output of print(3 + 2 * 4)?',
      options: ['20', '11', '14', 'Error'],
      correctAnswer: '11',
      points: 10,
    },
    {
      type: 'multi',
      question: 'Which of the following are control structures in Python?',
      options: ['if', 'for', 'while', 'switch', 'elif'],
      correctAnswer: ['if', 'for', 'while', 'elif'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'multi',
      question: 'Which of the following are valid Python variable names?',
      options: ['my_var', '2var', 'var_name', 'var-name', '_var'],
      correctAnswer: ['my_var', 'var_name', '_var'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'numeric',
      question: 'What is the result of 2 ** 3?',
      correctAnswer: 8,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'numeric',
      question: 'What is the value of 15 // 4?',
      correctAnswer: 3,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'short-text',
      question: 'What keyword is used to define a function in Python?',
      correctAnswer: 'def',
      points: 10,
    },
    {
      type: 'short-text',
      question: 'What keyword is used to exit a loop early in Python?',
      correctAnswer: 'break',
      points: 10,
    },
    {
      type: 'short-text',
      question: 'What function is used to get user input in Python?',
      correctAnswer: 'input',
      points: 10,
    },
  ],
  
  'CS201': [
    {
      type: 'mcq',
      question: 'What is the time complexity of accessing an element in an array?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 'O(1)',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'Which data structure follows LIFO principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 'Stack',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'What is the time complexity of binary search?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      correctAnswer: 'O(log n)',
      points: 10,
    },
    {
      type: 'multi',
      question: 'Which of the following are types of tree traversal?',
      options: ['Inorder', 'Preorder', 'Postorder', 'Sideorder', 'Level-order'],
      correctAnswer: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'multi',
      question: 'Which of the following are sorting algorithms?',
      options: ['Bubble Sort', 'Quick Sort', 'Hash Sort', 'Merge Sort', 'Stack Sort'],
      correctAnswer: ['Bubble Sort', 'Quick Sort', 'Merge Sort'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'numeric',
      question: 'What is the height of a binary tree with 7 nodes?',
      correctAnswer: 3,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'numeric',
      question: 'What is the maximum number of nodes in a binary tree of height 3?',
      correctAnswer: 7,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'short-text',
      question: 'What is the name of the algorithm that finds the shortest path in a weighted graph?',
      correctAnswer: 'Dijkstra',
      points: 10,
    },
  ],
  
  'MATH201': [
    {
      type: 'mcq',
      question: 'What is the derivative of x²?',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswer: '2x',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'What is the derivative of sin(x)?',
      options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
      correctAnswer: 'cos(x)',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'What is the derivative of e^x?',
      options: ['e^x', 'xe^x', 'ln(x)', '1/x'],
      correctAnswer: 'e^x',
      points: 10,
    },
    {
      type: 'multi',
      question: 'Which of the following are derivative rules?',
      options: ['Power Rule', 'Product Rule', 'Quotient Rule', 'Chain Rule', 'Sum Rule'],
      correctAnswer: ['Power Rule', 'Product Rule', 'Quotient Rule', 'Chain Rule', 'Sum Rule'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'numeric',
      question: 'What is the derivative of 3x² + 2x + 1 at x = 2?',
      correctAnswer: 14,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'numeric',
      question: 'What is the limit of (x² - 4) / (x - 2) as x approaches 2?',
      correctAnswer: 4,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'short-text',
      question: 'What is the name of the rule for finding the derivative of a product of two functions?',
      correctAnswer: 'product rule',
      points: 10,
    },
  ],
  
  'PHYS101': [
    {
      type: 'mcq',
      question: 'What is the unit of force in the SI system?',
      options: ['Joule', 'Newton', 'Watt', 'Pascal'],
      correctAnswer: 'Newton',
      points: 10,
    },
    {
      type: 'mcq',
      question: 'What is the acceleration due to gravity on Earth?',
      options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
      correctAnswer: '9.8 m/s²',
      points: 10,
    },
    {
      type: 'multi',
      question: 'Which of the following are vector quantities?',
      options: ['Velocity', 'Speed', 'Force', 'Mass', 'Acceleration'],
      correctAnswer: ['Velocity', 'Force', 'Acceleration'],
      points: 15,
      partialCredit: true,
    },
    {
      type: 'numeric',
      question: 'What is the kinetic energy of a 2 kg object moving at 5 m/s?',
      correctAnswer: 25,
      points: 10,
      tolerance: 0.1,
    },
    {
      type: 'numeric',
      question: 'What is the momentum of a 3 kg object moving at 4 m/s?',
      correctAnswer: 12,
      points: 10,
      tolerance: 0.1,
    },
  ]
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
  
  let createdCount = 0
  let skippedCount = 0
  
  for (const branch of branches) {
    try {
      // Get subject code for quiz questions
      const subjectDoc = await db.collection('subjects').doc(branch.subjectId).get()
      if (!subjectDoc.exists) continue
      
      const subject = subjectDoc.data()
      const subjectCode = subject?.code
      
      // Get quiz questions for this subject
      const questions = questionTemplates[subjectCode as keyof typeof questionTemplates] || []
      
      if (questions.length === 0) {
        console.log(`No question template for subject ${subjectCode}, skipping...`)
        continue
      }
      
      // Check if quizzes already exist for this branch
      const existingQuizzes = await db.collection('quizzes').where('branchId', '==', branch.id).get()
      
      if (!existingQuizzes.empty) {
        console.log(`Quizzes for branch ${branch.title} already exist, skipping...`)
        skippedCount++
        continue
      }
      
      // Create 2-4 quizzes per branch
      const numQuizzes = Math.floor(Math.random() * 3) + 2
      
      for (let i = 0; i < numQuizzes; i++) {
        const quizRef = db.collection('quizzes').doc()
        const now = new Date()
        
        // Select random questions for this quiz (3-6 questions)
        const numQuestions = Math.min(questions.length, 3 + Math.floor(Math.random() * 4))
        const quizQuestions = questions
          .sort(() => 0.5 - Math.random())
          .slice(0, numQuestions)
          .map((q, index) => ({ ...q, id: `q${index + 1}` }))
        
        const totalPoints = quizQuestions.reduce((sum, q) => sum + q.points, 0)
        
        const quiz = {
          id: quizRef.id,
          branchId: branch.id,
          weekNumber: i + 1,
          title: `Quiz ${i + 1}: ${subject?.title}`,
          description: `Quiz ${i + 1} covering topics from ${subject?.title}. This quiz contains ${numQuestions} questions and is worth ${totalPoints} points.`,
          questions: quizQuestions,
          timeLimit: 30 + (numQuestions * 5), // 30 minutes base + 5 minutes per question
          autoGrade: true,
          totalPoints,
          isActive: true,
          createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
          updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        }

        await quizRef.set(quiz)
        console.log(`✅ Created quiz: ${quiz.title} (${numQuestions} questions, ${totalPoints} points)`)
        createdCount++
      }
    } catch (error) {
      console.error(`❌ Error creating quizzes for branch ${branch.id}:`, error)
    }
  }
  
  console.log(`\n📊 Quiz seeding summary:`)
  console.log(`- Created: ${createdCount} quizzes`)
  console.log(`- Skipped: ${skippedCount} branches (already have quizzes)`)
  console.log(`- Total processed: ${branches.length} branches`)
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
  
  let createdCount = 0
  let skippedCount = 0
  
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
        
        if (!existingAttempt.empty) {
          skippedCount++
          continue
        }
        
        // Generate random answers with some intelligence
        const answers: Record<string, any> = {}
        let expectedScore = 0
        
        for (const question of quiz.questions) {
          const random = Math.random()
          
          switch (question.type) {
            case 'mcq':
              if (random < 0.7) {
                // 70% chance of correct answer
                answers[question.id] = question.correctAnswer
                expectedScore += question.points
              } else {
                // 30% chance of wrong answer
                const wrongOptions = question.options?.filter(opt => opt !== question.correctAnswer) || []
                answers[question.id] = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
              }
              break
              
            case 'multi':
              if (random < 0.6) {
                // 60% chance of correct answer
                answers[question.id] = question.correctAnswer
                expectedScore += question.points
              } else if (random < 0.8) {
                // 20% chance of partial credit
                const correctAnswers = question.correctAnswer as string[]
                const partialAnswers = correctAnswers.slice(0, Math.ceil(correctAnswers.length / 2))
                answers[question.id] = partialAnswers
                expectedScore += question.points * 0.5
              } else {
                // 20% chance of wrong answer
                const wrongOptions = question.options?.filter(opt => !(question.correctAnswer as string[]).includes(opt)) || []
                const numSelections = Math.floor(Math.random() * 3) + 1
                answers[question.id] = wrongOptions
                  .sort(() => 0.5 - Math.random())
                  .slice(0, numSelections)
              }
              break
              
            case 'numeric':
              const correctAnswer = parseFloat(question.correctAnswer as string)
              const tolerance = question.tolerance || 0.1
              
              if (random < 0.7) {
                // 70% chance of correct answer
                answers[question.id] = correctAnswer
                expectedScore += question.points
              } else {
                // 30% chance of wrong answer
                const wrongAnswer = correctAnswer + (Math.random() - 0.5) * correctAnswer * 0.5
                answers[question.id] = wrongAnswer
              }
              break
              
            case 'short-text':
              if (random < 0.6) {
                // 60% chance of correct answer
                answers[question.id] = question.correctAnswer
                expectedScore += question.points
              } else if (random < 0.8) {
                // 20% chance of close answer
                answers[question.id] = (question.correctAnswer as string) + ' (close)'
                expectedScore += question.points * 0.5
              } else {
                // 20% chance of wrong answer
                answers[question.id] = 'wrong answer'
              }
              break
          }
        }
        
        // Add some randomness to the final score
        const scoreVariation = (Math.random() - 0.5) * expectedScore * 0.2
        const finalScore = Math.max(0, Math.min(quiz.totalPoints, Math.round(expectedScore + scoreVariation)))
        const percentage = (finalScore / quiz.totalPoints) * 100
        
        const attemptRef = db.collection('quizAttempts').doc()
        const now = new Date()
        
        const attempt = {
          id: attemptRef.id,
          quizId: quiz.id,
          studentId,
          answers,
          score: finalScore,
          totalPoints: quiz.totalPoints,
          percentage,
          autoGraded: true,
          submittedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        }

        await attemptRef.set(attempt)
        console.log(`✅ Created quiz attempt for ${student.displayName} (${percentage.toFixed(1)}%)`)
        createdCount++
      }
    } catch (error) {
      console.error(`❌ Error creating quiz attempts for quiz ${quiz.id}:`, error)
    }
  }
  
  console.log(`\n📊 Quiz attempt seeding summary:`)
  console.log(`- Created: ${createdCount} quiz attempts`)
  console.log(`- Skipped: ${skippedCount} attempts (already exist)`)
}

async function main() {
  try {
    console.log('🚀 Starting quiz seeding...')
    await seedQuizzes()
    await seedQuizAttempts()
    console.log('✅ Quiz seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Quiz seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
