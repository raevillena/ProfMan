"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
const subjectSeeds = [
    {
        code: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'Basic concepts of computer science, programming fundamentals, and problem-solving techniques. Covers variables, control structures, functions, and basic algorithms.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
    },
    {
        code: 'CS102',
        title: 'Programming Fundamentals',
        description: 'Introduction to programming using Python. Covers data types, control structures, functions, file I/O, and object-oriented programming basics.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
        prerequisites: ['CS101'],
    },
    {
        code: 'CS201',
        title: 'Data Structures and Algorithms',
        description: 'Study of fundamental data structures and algorithm design techniques. Covers arrays, linked lists, stacks, queues, trees, graphs, and sorting algorithms.',
        isReusable: true,
        category: 'Computer Science',
        credits: 4,
        prerequisites: ['CS102'],
    },
    {
        code: 'CS202',
        title: 'Object-Oriented Programming',
        description: 'Advanced object-oriented programming concepts including inheritance, polymorphism, encapsulation, and design patterns.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
        prerequisites: ['CS102'],
    },
    {
        code: 'CS301',
        title: 'Database Systems',
        description: 'Introduction to database design, SQL, and database management systems. Covers relational model, normalization, transactions, and concurrency control.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
        prerequisites: ['CS201'],
    },
    {
        code: 'CS302',
        title: 'Software Engineering',
        description: 'Software development lifecycle, requirements analysis, system design, testing, and project management methodologies.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
        prerequisites: ['CS202'],
    },
    {
        code: 'CS401',
        title: 'Web Development',
        description: 'Full-stack web development using modern technologies. Covers HTML, CSS, JavaScript, React, Node.js, and database integration.',
        isReusable: true,
        category: 'Computer Science',
        credits: 4,
        prerequisites: ['CS202', 'CS301'],
    },
    {
        code: 'CS402',
        title: 'Mobile App Development',
        description: 'Development of mobile applications for iOS and Android platforms using React Native and native development tools.',
        isReusable: true,
        category: 'Computer Science',
        credits: 3,
        prerequisites: ['CS202'],
    },
    {
        code: 'MATH101',
        title: 'College Algebra',
        description: 'Algebraic concepts including linear equations, quadratic equations, polynomials, rational expressions, and exponential functions.',
        isReusable: true,
        category: 'Mathematics',
        credits: 3,
    },
    {
        code: 'MATH102',
        title: 'Trigonometry',
        description: 'Trigonometric functions, identities, equations, and applications in geometry and physics.',
        isReusable: true,
        category: 'Mathematics',
        credits: 3,
        prerequisites: ['MATH101'],
    },
    {
        code: 'MATH201',
        title: 'Calculus I',
        description: 'Differential and integral calculus of single variable functions. Limits, derivatives, and applications.',
        isReusable: true,
        category: 'Mathematics',
        credits: 4,
        prerequisites: ['MATH102'],
    },
    {
        code: 'MATH202',
        title: 'Calculus II',
        description: 'Advanced calculus topics including integration techniques, sequences, series, and differential equations.',
        isReusable: true,
        category: 'Mathematics',
        credits: 4,
        prerequisites: ['MATH201'],
    },
    {
        code: 'MATH301',
        title: 'Linear Algebra',
        description: 'Vector spaces, linear transformations, matrices, eigenvalues, and eigenvectors with applications.',
        isReusable: true,
        category: 'Mathematics',
        credits: 3,
        prerequisites: ['MATH202'],
    },
    {
        code: 'MATH302',
        title: 'Discrete Mathematics',
        description: 'Mathematical structures including sets, relations, functions, combinatorics, and graph theory.',
        isReusable: true,
        category: 'Mathematics',
        credits: 3,
        prerequisites: ['MATH201'],
    },
    {
        code: 'PHYS101',
        title: 'General Physics I',
        description: 'Mechanics, thermodynamics, and wave motion. Covers kinematics, dynamics, energy, momentum, and oscillations.',
        isReusable: true,
        category: 'Physics',
        credits: 4,
        prerequisites: ['MATH201'],
    },
    {
        code: 'PHYS102',
        title: 'General Physics II',
        description: 'Electricity, magnetism, and optics. Covers electric fields, magnetic fields, electromagnetic waves, and geometric optics.',
        isReusable: true,
        category: 'Physics',
        credits: 4,
        prerequisites: ['PHYS101'],
    },
    {
        code: 'PHYS201',
        title: 'Modern Physics',
        description: 'Introduction to quantum mechanics, relativity, atomic physics, and nuclear physics.',
        isReusable: true,
        category: 'Physics',
        credits: 3,
        prerequisites: ['PHYS102'],
    },
    {
        code: 'ENG101',
        title: 'Composition I',
        description: 'Introduction to academic writing, research methods, and critical thinking skills.',
        isReusable: true,
        category: 'English',
        credits: 3,
    },
    {
        code: 'ENG102',
        title: 'Composition II',
        description: 'Advanced writing skills, argumentation, and research paper development.',
        isReusable: true,
        category: 'English',
        credits: 3,
        prerequisites: ['ENG101'],
    },
    {
        code: 'ENG201',
        title: 'Technical Writing',
        description: 'Professional writing skills for technical communication, including reports, proposals, and documentation.',
        isReusable: true,
        category: 'English',
        credits: 3,
        prerequisites: ['ENG102'],
    },
    {
        code: 'BUS101',
        title: 'Introduction to Business',
        description: 'Overview of business concepts including management, marketing, finance, and operations.',
        isReusable: true,
        category: 'Business',
        credits: 3,
    },
    {
        code: 'BUS201',
        title: 'Principles of Management',
        description: 'Management theory and practice including planning, organizing, leading, and controlling.',
        isReusable: true,
        category: 'Business',
        credits: 3,
        prerequisites: ['BUS101'],
    },
    {
        code: 'BUS202',
        title: 'Principles of Marketing',
        description: 'Marketing concepts including market research, consumer behavior, and marketing mix strategies.',
        isReusable: true,
        category: 'Business',
        credits: 3,
        prerequisites: ['BUS101'],
    },
];
async function seedSubjects() {
    console.log('🌱 Seeding subjects...');
    const professorQuery = await db.collection('users').where('role', '==', 'professor').get();
    if (professorQuery.empty) {
        console.log('❌ No professor users found, skipping subjects...');
        return;
    }
    const professorIds = professorQuery.docs.map(doc => doc.id);
    let createdCount = 0;
    let skippedCount = 0;
    for (const subjectData of subjectSeeds) {
        try {
            const existingSubject = await db.collection('subjects').where('code', '==', subjectData.code).get();
            if (!existingSubject.empty) {
                console.log(`Subject ${subjectData.code} already exists, skipping...`);
                skippedCount++;
                continue;
            }
            const subjectRef = db.collection('subjects').doc();
            const now = new Date();
            const randomProfessorId = professorIds[Math.floor(Math.random() * professorIds.length)];
            const subject = {
                id: subjectRef.id,
                code: subjectData.code,
                title: subjectData.title,
                description: subjectData.description,
                isReusable: subjectData.isReusable,
                category: subjectData.category,
                credits: subjectData.credits,
                prerequisites: subjectData.prerequisites || [],
                createdBy: randomProfessorId,
                createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
                updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            };
            await subjectRef.set(subject);
            console.log(`✅ Created subject: ${subjectData.code} - ${subjectData.title} (${subjectData.category})`);
            createdCount++;
        }
        catch (error) {
            console.error(`❌ Error creating subject ${subjectData.code}:`, error);
        }
    }
    console.log(`\n📊 Subject seeding summary:`);
    console.log(`- Created: ${createdCount} subjects`);
    console.log(`- Skipped: ${skippedCount} subjects (already exist)`);
    console.log(`- Total processed: ${subjectSeeds.length} subjects`);
    const categories = subjectSeeds.reduce((acc, subject) => {
        acc[subject.category] = (acc[subject.category] || 0) + 1;
        return acc;
    }, {});
    console.log(`\n📚 Categories:`);
    Object.entries(categories).forEach(([category, count]) => {
        console.log(`- ${category}: ${count} subjects`);
    });
}
async function main() {
    try {
        console.log('🚀 Starting subject seeding...');
        await seedSubjects();
        console.log('✅ Subject seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Subject seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seedSubjects.js.map