# Biological Verification System (BVS)

## Overview
The Biological Verification System (BVS) is a full-stack web application designed for crime control and biometric verification. It includes features for biometric enrollment, verification, case management, a searchable database, audit logs, and role-based administration.

## Project Structure
```
/bvs-app/
├── client/                 # Frontend static files
│   ├── index.html         # Dashboard
│   ├── biometric.html     # Biometric capture
│   ├── cases.html         # Case management
│   ├── search.html        # Database search
│   ├── admin.html         # Admin panel
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── css/
│   │   ├── style.css      # Main styles
│   │   └── theme.css      # Dark/light theme
│   ├── js/
│   │   ├── app.js         # Main application logic
│   │   ├── biometric.js    # Biometric capture logic
│   │   ├── cases.js       # Case management
│   │   ├── search.js      # Search functionality
│   │   ├── admin.js       # Admin functionality
│   │   └── auth.js        # Authentication handling
│   └── assets/            # Images, icons, etc.
├── server/                # Backend API
│   ├── src/
│   │   ├── index.js       # Main server file
│   │   ├── config/        # Configuration
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── adapters/      # Biometric adapters
│   │   ├── models/        # Database models
│   │   ├── utils/         # Utility functions
│   │   └── seed/          # Database seeding
│   ├── database/          # SQLite database
│   ├── tests/             # Playwright tests
│   ├── .env.example       # Environment variables template
│   └── package.json       # Server dependencies
├── package.json           # Root package.json for scripts
├── README.md              # Documentation
└── playwright.config.js    # Playwright configuration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- SQLite3

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bvs-app
   ```

2. Install dependencies:
   ```bash
   npm run setup
   ```

3. Initialize the database:
   ```bash
   cd server
   node src/seed/initDB.js
   node src/seed/seedData.js
   ```

### Running the Application
- Start the development server:
  ```bash
  npm run dev
  ```

- Open the application in your browser:
  ```
  http://localhost:5173
  ```

### Environment Variables
Create a `.env` file in the `server` directory based on the `.env.example` template.

### API Endpoints
- **Authentication**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`

- **Biometric Operations**
  - `POST /api/fingerprint/enroll`
  - `POST /api/fingerprint/verify`
  - `POST /api/face/enroll`
  - `POST /api/face/verify`
  - `POST /api/iris/enroll`
  - `POST /api/iris/verify`
  - `POST /api/dna/enroll`
  - `POST /api/dna/verify`

- **Case Management**
  - `POST /api/case`
  - `GET /api/case/:id`
  - `PATCH /api/case/:id`
  - `POST /api/case/:id/note`
  - `POST /api/case/:id/attach`

- **Search**
  - `GET /api/search`

### Testing
- Run Playwright tests:
  ```bash
  npm test
  ```

## Notes on Swapping in Real SDKs
- Each biometric adapter has placeholder methods for integrating real SDKs. Replace the mock implementations with actual SDK calls as needed.

## License
This project is licensed under the MIT License.
