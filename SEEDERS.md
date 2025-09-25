# ProfMan Data Seeders

This document describes the comprehensive data seeding system for ProfMan, which creates realistic mock data for testing and development.

## Overview

The seeding system consists of multiple specialized seeders that create different types of data:

- **Users**: Admin, professors, and students with realistic profiles
- **Subjects**: Academic subjects across different categories
- **Branches**: Class instances with enrolled students and week structures
- **Quizzes**: Interactive quizzes with various question types
- **Quiz Attempts**: Realistic student responses with intelligent scoring
- **Announcements**: Course announcements and notifications

## Available Seeders

### 1. Master Seeder (`seedAll`)
Runs all individual seeders in the correct order and clears existing data.

```bash
npm run seed:all
```

**What it does:**
- Clears all existing data from the database
- Runs all individual seeders in sequence
- Provides comprehensive summary of created data

### 2. Individual Seeders

#### Users Seeder (`seedUsers`)
Creates user accounts with different roles.

```bash
npm run seed:users
```

**Creates:**
- 2 Admin users
- 5 Professor users
- 10 Student users

**Sample Accounts:**
- Admin: `admin@profman.com` / `admin123`
- Professor: `prof.smith@university.edu` / `prof123`
- Student: `student1@university.edu` / `12345`

#### Subjects Seeder (`seedSubjects`)
Creates academic subjects across different categories.

```bash
npm run seed:subjects
```

**Creates:**
- 20+ subjects across categories:
  - Computer Science (8 subjects)
  - Mathematics (6 subjects)
  - Physics (3 subjects)
  - English (3 subjects)
  - Business (3 subjects)

**Features:**
- Prerequisites relationships
- Credit hours
- Detailed descriptions
- Reusable subjects

#### Branches Seeder (`seedBranches`)
Creates class instances with enrolled students and week structures.

```bash
npm run seed:branches
```

**Creates:**
- One branch per subject
- 3-8 students enrolled per branch
- Detailed week structures with:
  - Lectures
  - Quizzes
  - Exams
  - Resources
- Realistic course progression

#### Quizzes Seeder (`seedQuizzes`)
Creates interactive quizzes with various question types.

```bash
npm run seed:quizzes
```

**Creates:**
- 2-4 quizzes per branch
- Questions across different types:
  - Multiple Choice (MCQ)
  - Multi-select
  - Numeric answers
  - Short text answers
- Realistic scoring and time limits

#### Quiz Attempts Seeder (`seedQuizzes`)
Creates realistic student quiz attempts with intelligent scoring.

```bash
npm run seed:quizzes
```

**Features:**
- Intelligent answer generation (70% correct, 30% wrong)
- Partial credit for multi-select questions
- Realistic score distribution
- Auto-grading simulation

#### Announcements Seeder (`seedAnnouncements`)
Creates course announcements and notifications.

```bash
npm run seed:announcements
```

**Creates:**
- 3-6 announcements per branch
- Different types: info, warning, success, urgent
- Targeted audiences: all, students, professors
- Realistic course-related content

## Data Quality Features

### Realistic Relationships
- Students are randomly enrolled in branches
- Professors are randomly assigned to subjects
- Prerequisites are properly maintained
- Week structures follow logical progression

### Intelligent Quiz Generation
- Questions are subject-specific
- Difficulty varies appropriately
- Answer generation simulates real student behavior
- Scoring includes partial credit and realistic distributions

### Comprehensive Coverage
- Multiple subjects across different disciplines
- Various question types and difficulty levels
- Realistic time constraints and point values
- Proper data validation and error handling

## Usage Examples

### Quick Start
```bash
# Clear database and seed all data
npm run seed:all
```

### Incremental Seeding
```bash
# Seed only users
npm run seed:users

# Seed subjects (requires users)
npm run seed:subjects

# Seed branches (requires users and subjects)
npm run seed:branches
```

### Development Workflow
```bash
# Start with fresh data
npm run seed:all

# Make changes to seeders
# Re-run specific seeder
npm run seed:quizzes

# Or re-run all
npm run seed:all
```

## Customization

### Adding New Subjects
Edit `backend/src/scripts/seedSubjects.ts`:

```typescript
const subjectSeeds: SubjectData[] = [
  // Add your new subjects here
  {
    code: 'CS999',
    title: 'Advanced Topics',
    description: 'Your description here',
    isReusable: true,
    category: 'Computer Science',
    credits: 3,
    prerequisites: ['CS201'],
  },
]
```

### Adding New Question Types
Edit `backend/src/scripts/seedQuizzes.ts`:

```typescript
const questionTemplates: Record<string, Omit<QuizQuestion, 'id'>[]> = {
  'CS999': [
    {
      type: 'mcq',
      question: 'Your question here?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 1',
      points: 10,
    },
  ],
}
```

### Modifying User Data
Edit `backend/src/scripts/seedUsers.ts`:

```typescript
const userSeeds: UserData[] = [
  // Add your custom users here
  {
    email: 'custom@example.com',
    password: 'password123',
    displayName: 'Custom User',
    role: 'student',
    studentNumber: '99999',
  },
]
```

## Data Validation

All seeders include:
- Duplicate prevention (skip existing data)
- Error handling and logging
- Data integrity checks
- Comprehensive progress reporting

## Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Ensure Firebase is properly configured
   - Check environment variables
   - Verify service account permissions

2. **Duplicate Data**
   - Seeders automatically skip existing data
   - Use `seed:all` to clear and re-seed
   - Check console output for skip messages

3. **Missing Dependencies**
   - Ensure all required data exists (users before subjects, etc.)
   - Run seeders in the correct order
   - Use `seed:all` for proper sequencing

### Debug Mode
Add logging to see detailed progress:

```bash
# Run with verbose output
DEBUG=* npm run seed:all
```

## Performance

- **Users**: ~2 seconds for 17 users
- **Subjects**: ~3 seconds for 20+ subjects
- **Branches**: ~5 seconds for 20+ branches
- **Quizzes**: ~10 seconds for 100+ quizzes
- **Quiz Attempts**: ~15 seconds for 500+ attempts
- **Announcements**: ~5 seconds for 100+ announcements

**Total**: ~40 seconds for complete database seeding

## Best Practices

1. **Always run `seed:all` for fresh data**
2. **Don't run individual seeders out of order**
3. **Check console output for errors**
4. **Verify data in Firebase console**
5. **Use realistic data for testing**

## Contributing

When adding new seeders:

1. Follow the existing pattern
2. Include comprehensive logging
3. Add error handling
4. Update this documentation
5. Test with `seed:all`

## Support

For issues with seeders:
1. Check the console output
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Try running `seed:all` to reset everything
