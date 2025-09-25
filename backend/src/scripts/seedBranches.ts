import { initializeFirebase, getFirestore } from '../utils/firebase'

// Initialize Firebase
initializeFirebase()

const db = getFirestore()

interface WeekContent {
  type: 'lecture' | 'quiz' | 'exam' | 'resource'
  title: string
  description: string
  isRequired: boolean
  points?: number
  dueDate?: any
}

interface WeekStructure {
  weekNumber: number
  title: string
  description: string
  contents: WeekContent[]
}

// Week content templates for different subjects
const weekContentTemplates: Record<string, WeekStructure[]> = {
  'CS101': [
    {
      weekNumber: 1,
      title: 'Introduction to Programming',
      description: 'Welcome to CS101! This week we\'ll cover the basics of programming and problem-solving.',
      contents: [
        {
          type: 'lecture',
          title: 'What is Programming?',
          description: 'Introduction to programming concepts and problem-solving approaches.',
          isRequired: true,
        },
        {
          type: 'resource',
          title: 'Course Syllabus',
          description: 'Download and review the course syllabus and schedule.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Variables and Data Types',
      description: 'Learn about variables, data types, and basic operations in Python.',
      contents: [
        {
          type: 'lecture',
          title: 'Variables in Python',
          description: 'Understanding variables, naming conventions, and assignment.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Data Types',
          description: 'Numbers, strings, booleans, and type conversion.',
          isRequired: true,
        },
        {
          type: 'resource',
          title: 'Python Cheat Sheet',
          description: 'Quick reference for Python syntax and built-in functions.',
          isRequired: false,
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Control Structures',
      description: 'Conditional statements and loops for program flow control.',
      contents: [
        {
          type: 'lecture',
          title: 'If Statements',
          description: 'Conditional execution and boolean expressions.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Loops',
          description: 'For loops, while loops, and loop control statements.',
          isRequired: true,
        },
        {
          type: 'quiz',
          title: 'Control Structures Quiz',
          description: 'Test your understanding of conditional statements and loops.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Functions and Modules',
      description: 'Creating reusable code with functions and organizing code with modules.',
      contents: [
        {
          type: 'lecture',
          title: 'Defining Functions',
          description: 'Function syntax, parameters, and return values.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Function Scope',
          description: 'Local and global variables, function scope rules.',
          isRequired: true,
        },
        {
          type: 'resource',
          title: 'Practice Exercises',
          description: 'Hands-on exercises to practice function writing.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 5,
      title: 'Midterm Assessment',
      description: 'Midterm quiz covering all topics from weeks 1-4.',
      contents: [
        {
          type: 'quiz',
          title: 'Midterm Quiz',
          description: 'Comprehensive quiz covering programming fundamentals.',
          isRequired: true,
          points: 200,
          dueDate: { seconds: Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    }
  ],
  
  'CS201': [
    {
      weekNumber: 1,
      title: 'Introduction to Data Structures',
      description: 'Overview of data structures and algorithm analysis.',
      contents: [
        {
          type: 'lecture',
          title: 'What are Data Structures?',
          description: 'Introduction to data structures and their importance.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Algorithm Analysis',
          description: 'Big O notation and time complexity analysis.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Arrays and Linked Lists',
      description: 'Linear data structures and their implementations.',
      contents: [
        {
          type: 'lecture',
          title: 'Arrays',
          description: 'Static and dynamic arrays, array operations.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Linked Lists',
          description: 'Singly and doubly linked lists, operations.',
          isRequired: true,
        },
        {
          type: 'quiz',
          title: 'Arrays and Lists Quiz',
          description: 'Test your understanding of linear data structures.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Stacks and Queues',
      description: 'LIFO and FIFO data structures and their applications.',
      contents: [
        {
          type: 'lecture',
          title: 'Stack Implementation',
          description: 'Stack operations and applications.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Queue Implementation',
          description: 'Queue operations and variations.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Trees and Binary Trees',
      description: 'Hierarchical data structures and tree traversal.',
      contents: [
        {
          type: 'lecture',
          title: 'Tree Basics',
          description: 'Tree terminology and properties.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Binary Trees',
          description: 'Binary tree properties and operations.',
          isRequired: true,
        },
        {
          type: 'quiz',
          title: 'Trees Quiz',
          description: 'Test your understanding of tree structures.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    },
    {
      weekNumber: 5,
      title: 'Binary Search Trees',
      description: 'Ordered binary trees and their operations.',
      contents: [
        {
          type: 'lecture',
          title: 'BST Properties',
          description: 'Binary search tree properties and invariants.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'BST Operations',
          description: 'Insertion, deletion, and search in BSTs.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 6,
      title: 'Hash Tables',
      description: 'Hash functions and collision resolution techniques.',
      contents: [
        {
          type: 'lecture',
          title: 'Hash Functions',
          description: 'Hash function design and properties.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Collision Resolution',
          description: 'Chaining and open addressing methods.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 7,
      title: 'Graphs',
      description: 'Graph representation and traversal algorithms.',
      contents: [
        {
          type: 'lecture',
          title: 'Graph Representation',
          description: 'Adjacency matrix and adjacency list representations.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Graph Traversal',
          description: 'BFS and DFS algorithms.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 8,
      title: 'Sorting Algorithms',
      description: 'Comparison-based and non-comparison sorting algorithms.',
      contents: [
        {
          type: 'lecture',
          title: 'Comparison Sorts',
          description: 'Bubble sort, insertion sort, merge sort, quick sort.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Non-Comparison Sorts',
          description: 'Counting sort, radix sort, bucket sort.',
          isRequired: true,
        },
        {
          type: 'quiz',
          title: 'Sorting Quiz',
          description: 'Test your understanding of sorting algorithms.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    },
    {
      weekNumber: 9,
      title: 'Searching Algorithms',
      description: 'Linear and binary search algorithms.',
      contents: [
        {
          type: 'lecture',
          title: 'Linear Search',
          description: 'Sequential search and its complexity.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Binary Search',
          description: 'Divide and conquer search algorithm.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 10,
      title: 'Final Exam',
      description: 'Comprehensive final exam covering all course topics.',
      contents: [
        {
          type: 'exam',
          title: 'Final Exam',
          description: 'Comprehensive exam covering all data structures and algorithms.',
          isRequired: true,
          points: 300,
          dueDate: { seconds: Math.floor((Date.now() + 14 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    }
  ],
  
  'MATH201': [
    {
      weekNumber: 1,
      title: 'Limits and Continuity',
      description: 'Introduction to limits and continuous functions.',
      contents: [
        {
          type: 'lecture',
          title: 'Introduction to Limits',
          description: 'Definition of limits and limit laws.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Continuity',
          description: 'Continuous functions and continuity tests.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Derivatives',
      description: 'Definition and basic rules of differentiation.',
      contents: [
        {
          type: 'lecture',
          title: 'Definition of Derivative',
          description: 'Limit definition of the derivative.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Derivative Rules',
          description: 'Power rule, product rule, quotient rule.',
          isRequired: true,
        },
        {
          type: 'quiz',
          title: 'Derivatives Quiz',
          description: 'Practice with basic derivative calculations.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Chain Rule and Implicit Differentiation',
      description: 'Advanced differentiation techniques.',
      contents: [
        {
          type: 'lecture',
          title: 'Chain Rule',
          description: 'Derivative of composite functions.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Implicit Differentiation',
          description: 'Finding derivatives of implicitly defined functions.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Applications of Derivatives',
      description: 'Using derivatives to solve optimization problems.',
      contents: [
        {
          type: 'lecture',
          title: 'Related Rates',
          description: 'Solving problems involving changing quantities.',
          isRequired: true,
        },
        {
          type: 'lecture',
          title: 'Optimization',
          description: 'Finding maximum and minimum values.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 5,
      title: 'Midterm Exam',
      description: 'Midterm exam covering limits, derivatives, and applications.',
      contents: [
        {
          type: 'exam',
          title: 'Midterm Exam',
          description: 'Comprehensive exam on limits and derivatives.',
          isRequired: true,
          points: 200,
          dueDate: { seconds: Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    }
  ]
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
  
  let createdCount = 0
  let skippedCount = 0
  
  // Create branches for each subject
  for (const subject of subjects) {
    try {
      // Check if branch already exists for this subject
      const existingBranch = await db.collection('branches').where('subjectId', '==', subject.id).get()
      
      if (!existingBranch.empty) {
        console.log(`Branch for subject ${subject.code} already exists, skipping...`)
        skippedCount++
        continue
      }

      // Assign to random professor
      const randomProfessor = professors[Math.floor(Math.random() * professors.length)]
      
      // Enroll random students (3-8 students per branch)
      const numStudents = Math.floor(Math.random() * 6) + 3
      const enrolledStudents = students
        .sort(() => 0.5 - Math.random())
        .slice(0, numStudents)
        .map(student => student.id)
      
      // Get week structure for this subject
      const weekStructure = weekContentTemplates[subject.code] || generateDefaultWeekStructure(subject.title)
      
      const branchRef = db.collection('branches').doc()
      const now = new Date()
      
      const branch = {
        id: branchRef.id,
        subjectId: subject.id,
        professorId: randomProfessor.id,
        title: `${subject.title} - ${randomProfessor.displayName} - Fall 2024`,
        description: `This is a branch of ${subject.title} taught by ${randomProfessor.displayName}. This course covers ${subject.description}`,
        weekStructure,
        students: enrolledStudents,
        createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
        updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      }

      await branchRef.set(branch)
      console.log(`✅ Created branch: ${branch.title} (${enrolledStudents.length} students enrolled)`)
      createdCount++
    } catch (error) {
      console.error(`❌ Error creating branch for subject ${subject.code}:`, error)
    }
  }
  
  console.log(`\n📊 Branch seeding summary:`)
  console.log(`- Created: ${createdCount} branches`)
  console.log(`- Skipped: ${skippedCount} branches (already exist)`)
  console.log(`- Total processed: ${subjects.length} subjects`)
}

function generateDefaultWeekStructure(subjectTitle: string): WeekStructure[] {
  return [
    {
      weekNumber: 1,
      title: 'Introduction',
      description: `Introduction to ${subjectTitle}`,
      contents: [
        {
          type: 'lecture',
          title: 'Course Overview',
          description: `Welcome to ${subjectTitle}! This week we'll cover the course overview and expectations.`,
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Fundamentals',
      description: `Basic concepts in ${subjectTitle}`,
      contents: [
        {
          type: 'lecture',
          title: 'Basic Concepts',
          description: 'Introduction to fundamental concepts.',
          isRequired: true,
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Midterm Assessment',
      description: 'Midterm quiz',
      contents: [
        {
          type: 'quiz',
          title: 'Midterm Quiz',
          description: 'Test your understanding of the material covered so far.',
          isRequired: true,
          points: 100,
          dueDate: { seconds: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), nanoseconds: 0 }
        }
      ]
    }
  ]
}

async function main() {
  try {
    console.log('🚀 Starting branch seeding...')
    await seedBranches()
    console.log('✅ Branch seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Branch seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding
main()
