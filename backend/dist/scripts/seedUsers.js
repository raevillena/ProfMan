"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../utils/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
(0, firebase_1.initializeFirebase)();
const db = (0, firebase_1.getFirestore)();
const userSeeds = [
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
];
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function seedUsers() {
    console.log('🌱 Seeding users...');
    let createdCount = 0;
    let skippedCount = 0;
    for (const userData of userSeeds) {
        try {
            const existingUser = await db.collection('users').where('email', '==', userData.email).get();
            if (!existingUser.empty) {
                console.log(`User ${userData.email} already exists, skipping...`);
                skippedCount++;
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
            console.log(`✅ Created user: ${userData.email} (${userData.role})`);
            createdCount++;
        }
        catch (error) {
            console.error(`❌ Error creating user ${userData.email}:`, error);
        }
    }
    console.log(`\n📊 User seeding summary:`);
    console.log(`- Created: ${createdCount} users`);
    console.log(`- Skipped: ${skippedCount} users (already exist)`);
    console.log(`- Total processed: ${userSeeds.length} users`);
}
async function main() {
    try {
        console.log('🚀 Starting user seeding...');
        await seedUsers();
        console.log('✅ User seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ User seeding failed:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=seedUsers.js.map