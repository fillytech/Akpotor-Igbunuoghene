const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, '../../database/bvs.db');
const db = new Database(dbPath);

console.log('Seeding BVS Database with initial data...');

// Hash password function
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

// Seed data
const seedData = async () => {
    try {
        // Create admin user
        const adminPasswordHash = await hashPassword('ChangeMe!123');
        const insertUser = db.prepare(`
            INSERT OR IGNORE INTO users (email, password_hash, role) 
            VALUES (?, ?, ?)
        `);
        
        insertUser.run('admin@bvs.local', adminPasswordHash, 'admin');
        console.log('Admin user created: admin@bvs.local / ChangeMe!123');

        // Create test users
        const testUsers = [
            ['officer1@bvs.local', await hashPassword('Officer123!'), 'officer'],
            ['analyst1@bvs.local', await hashPassword('Analyst123!'), 'analyst']
        ];

        testUsers.forEach(([email, passwordHash, role]) => {
            insertUser.run(email, passwordHash, role);
            console.log(`User created: ${email} / ${role}`);
        });

        // Create sample persons
        const insertPerson = db.prepare(`
            INSERT INTO persons (first_name, last_name, dob, national_id)
            VALUES (?, ?, ?, ?)
        `);

        const persons = [
            ['John', 'Doe', '1985-05-15', 'NAT123456'],
            ['Jane', 'Smith', '1990-08-22', 'NAT789012'],
            ['Bob', 'Johnson', '1978-12-03', 'NAT345678']
        ];

        persons.forEach(([first, last, dob, nationalId]) => {
            insertPerson.run(first, last, dob, nationalId);
            console.log(`Person created: ${first} ${last}`);
        });

        // Create sample cases
        const insertCase = db.prepare(`
            INSERT INTO cases (title, status, assigned_to)
            VALUES (?, ?, ?)
        `);

        const cases = [
            ['Burglary Investigation', 'open', 2],
            ['Identity Theft Case', 'in-review', 3],
            ['Missing Person', 'matched', 2]
        ];

        cases.forEach(([title, status, assigned]) => {
            insertCase.run(title, status, assigned);
            console.log(`Case created: ${title}`);
        });

        // Create sample matches
        const insertMatch = db.prepare(`
            INSERT INTO matches (query_modality, candidate_person_id, score)
            VALUES (?, ?, ?)
        `);

        const matches = [
            ['face', 1, 0.92],
            ['fingerprint', 2, 0.87],
            ['iris', 3, 0.95]
        ];

        matches.forEach(([modality, personId, score]) => {
            insertMatch.run(modality, personId, score);
            console.log(`Match created: ${modality} for person ${personId}`);
        });

        console.log('Database seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        db.close();
    }
};

seedData();
