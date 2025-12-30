# TeamTaskManager
A tool for task organization and team collaboration

## Product Overview
Teams collaborate on projects by creating tasks, assigning owners, tracking progress, and discussing updates.

Users:
- Admin
- Team Member
- Viewer (read-only)

Features:
- Teams & projects
- Tasks with status, priority, deadlines
- User assignment
- Comments & activity log
- Authentication & authorization

## Architecture
MERN Stack:
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB (Atlas)
- Auth: JWT (access + refresh tokens)

React (Client)

&emsp;↓ REST API (JWT)
   
Express Server

&emsp;↓
   
MongoDB (Users, Teams, Tasks, Comments)

