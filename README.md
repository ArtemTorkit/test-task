# Quiz Application

A full-stack quiz app with React (Vite) frontend and Node.js/Express backend using Prisma + SQLite.

## 🛠️ Setup

### Backend
```bash
cd backend
npm install
touch prisma/database.db
npx prisma migrate dev --name init
npm run dev  # Starts on http://localhost:1111

### Frontend
cd ../frontend
npm install
npm run dev  # Starts on http://localhost:5173

### Creating Quizzes
Via Web Interface
Visit http://localhost:5173/quizzes/new

Add title and questions

Submit

Via API
bash
curl -X POST http://localhost:1111/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title":"Science Quiz","questions":[{"text":"Is water wet?","type":"BOOLEAN"}]}'
