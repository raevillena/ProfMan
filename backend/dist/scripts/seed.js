"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
const seedUsers = [
    {
        email: 'admin@profman.com',
        password: 'admin123',
        displayName: 'System Administrator',
        role: 'admin',
    },
    {
        email: 'prof@profman.com',
        password: 'prof123',
        displayName: 'Professor Smith',
        role: 'professor',
    },
    {
        email: 'student1@university.edu',
        password: '12345',
        displayName: 'John Doe',
        role: 'student',
        studentNumber: '12345',
    },
    {
        email: 'student2@university.edu',
        password: '67890',
        displayName: 'Jane Smith',
        role: 'student',
        studentNumber: '67890',
    },
];
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function seedUsers() {
    console.log('🌱 Seeding users...');
    for (const userData of seedUsers) {
        try {
            const existingUser = await db.collection('users').where('email', '==', userData.email).get();
            if (!existingUser.empty) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }
            const passwordHash = await hashPassword(userData.password);
            const userRef = db.collection('users').doc();
            const now = new Date();
            const user = {
                id: userRef.id,
                email: userData.email,
                passwordHash,
                displayName: userData.displayName,
                role: userData.role,
                studentNumber: userData.studentNumber,
                isActive: true,
                isDeleted: false,
                createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
                updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            };
            await userRef.set(user);
            console.log(`✅ Created user: ${userData.email}`);
        }
        catch (error) {
            console.error(`❌ Error creating user ${userData.email}:`, error);
        }
    }
}
async function seedSubjects() {
    console.log('🌱 Seeding subjects...');
    const professorQuery = await db.collection('users').where('email', '==', 'prof@profman.com').get();
    if (professorQuery.empty) {
        console.log('❌ Professor user not found, skipping subjects...');
        return;
    }
    const professorId = professorQuery.docs[0].id;
    const subjects = [
        {
            code: 'CS101',
            title: 'Introduction to Computer Science',
            description: 'Basic concepts of computer science and programming',
            isReusable: true,
        },
        {
            code: 'MATH201',
            title: 'Calculus I',
            description: 'Differential and integral calculus',
            isReusable: true,
        },
    ];
    for (const subjectData of subjects) {
        try {
            const existingSubject = await db.collection('subjects').where('code', '==', subjectData.code).get();
            if (!existingSubject.empty) {
                console.log(`Subject ${subjectData.code} already exists, skipping...`);
                continue;
            }
            const subjectRef = db.collection('subjects').doc();
            const now = new Date();
            const subject = {
                id: subjectRef.id,
                ...subjectData,
                createdBy: professorId,
                createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
                updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            };
            await subjectRef.set(subject);
            console.log(`✅ Created subject: ${subjectData.code}`);
        }
        catch (error) {
            console.error(`❌ Error creating subject ${subjectData.code}:`, error);
        }
    }
}
async function main() {
    try {
        console.log('🚀 Starting database seeding...');
        await seedUsers();
        await seedSubjects();
        console.log('✅ Database seeding completed successfully!');
        console.log('\n📋 Sample accounts created:');
        console.log('Admin: admin@profman.com / admin123');
        console.log('Professor: prof@profman.com / prof123');
        console.log('Student 1: student1@university.edu / 12345');
        console.log('Student 2: student2@university.edu / 67890');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seed.js.map