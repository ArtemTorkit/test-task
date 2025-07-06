
📦 Backend Setup
Install dependencies:

bash
cd backend
npm install
Set up the database (SQLite via Prisma):

bash
npx prisma init
Edit prisma/schema.prisma to define your models. Then run:

bash
npx prisma migrate dev --name init
This will create the SQLite DB and apply the schema.

Start the backend server:

bash
npm run dev
The backend will start on http://localhost:3000 (or your configured port).

💻 Frontend Setup
Install dependencies:

bash
cd frontend
npm install
Start the frontend (Vite):

bash
npm run dev
This will launch the React app on http://localhost:5173 (default Vite port).

🧪 Create a Sample Quiz
Using Prisma Studio (optional visual editor):

bash
npx prisma studio
Use the UI to manually add a quiz and related questions to the database.

Or via API (example using cURL):

bash
curl -X POST http://localhost:3000/api/quizzes \
-H "Content-Type: application/json" \
-d '{
  "title": "Sample Quiz",
  "questions": [
    {
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5"],
      "answer": "4"
    },
    {
      "text": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris"],
      "answer": "Paris"
    }
  ]
}'
This assumes your backend has a POST route at /api/quizzes that handles nested question creation.

