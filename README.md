
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
The backend will start on http://localhost:1111 

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


