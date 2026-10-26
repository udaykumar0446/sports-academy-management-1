# Sports Academy Management

Full-stack project: Angular frontend, Node.js + Express REST API, JSON-file data storage.

## Requirements
Install Node.js 20.19+ or 22.12+ and VS Code.

## Run backend
```bash
cd backend
npm install
npm run dev
```
API: http://localhost:3000/api/athletes

## Run frontend (second terminal)
```bash
cd frontend
npm install
npm start
```
Open http://localhost:4200

Athlete data is stored in `backend/data/athletes.json`. JSON-file storage is suitable for a coursework/demo project, not multi-instance production use. Some cloud hosts have ephemeral filesystems, so configure persistent storage if deploying.

API endpoints: GET/POST `/api/athletes`, PUT/DELETE `/api/athletes/:id`, GET `/api/dashboard`.
