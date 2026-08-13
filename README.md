# TeamTaskManager
A tool for task organization and team collaboration

## Product Overview
Teams collaborate on projects by creating tasks, assigning owners, tracking progress, and discussing updates.

Users:
- Owner
- Admin
- Editor
- Viewer

Features (In Progress):
- [x] Workspaces & projects
   - [ ] Sharing between members
- [x] Tasks
   - [x] Status
   - [ ] Priority
   - [ ] Deadlines
- [x] Views
   - [x] Kanban board
   - [ ] List 
- [ ] User assignment
- [ ] Comments & activity log
- [x] Authentication & authorization

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
   
MongoDB (User, Workspace, WorkspaceMember, Project, Status, Task)

