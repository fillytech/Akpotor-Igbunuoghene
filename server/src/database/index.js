const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'bvs.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create prepared statements for common operations
const stmts = {
    // User operations
    getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
    getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
    insertUser: db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'),
    
    // Person operations
    getPersonById: db.prepare('SELECT * FROM persons WHERE id = ?'),
    getPersonByNationalId: db.prepare('SELECT * FROM persons WHERE national_id = ?'),
    insertPerson: db.prepare('INSERT INTO persons (first_name, last_name, dob, national_id) VALUES (?, ?, ?, ?)'),
    searchPersons: db.prepare('SELECT * FROM persons WHERE first_name LIKE ? OR last_name LIKE ? OR national_id LIKE ?'),
    
    // Biometric operations
    getBiometricById: db.prepare('SELECT * FROM biometrics WHERE id = ?'),
    getBiometricsByPersonId: db.prepare('SELECT * FROM biometrics WHERE person_id = ?'),
    getBiometricsByModality: db.prepare('SELECT * FROM biometrics WHERE modality = ?'),
    insertBiometric: db.prepare('INSERT INTO biometrics (person_id, modality, template, metadata_json) VALUES (?, ?, ?, ?)'),
    
    // Case operations
    getCaseById: db.prepare('SELECT * FROM cases WHERE id = ?'),
    getCasesByStatus: db.prepare('SELECT * FROM cases WHERE status = ?'),
    insertCase: db.prepare('INSERT INTO cases (title, status, assigned_to) VALUES (?, ?, ?)'),
    updateCaseStatus: db.prepare('UPDATE cases SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
    
    // Match operations
    getRecentMatches: db.prepare('SELECT * FROM matches ORDER BY created_at DESC LIMIT 10'),
    insertMatch: db.prepare('INSERT INTO matches (query_modality, candidate_person_id, score) VALUES (?, ?, ?)'),
    
    // Audit operations
    insertAudit: db.prepare('INSERT INTO audit (actor_user_id, action, entity, entity_id, meta_json) VALUES (?, ?, ?, ?, ?)')
};

// KPI queries
const kpiQueries = {
    totalRecords: db.prepare('SELECT COUNT(*) as count FROM persons'),
    totalMatches: db.prepare('SELECT COUNT(*) as count FROM matches WHERE created_at >= datetime("now", "-7 days")'),
    pendingCases: db.prepare('SELECT COUNT(*) as count FROM cases WHERE status IN ("open", "in-review")')
};

module.exports = {
    db,
    stmts,
    kpiQueries
};
