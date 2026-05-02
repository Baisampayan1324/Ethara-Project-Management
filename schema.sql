-- User Roles Enum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- Task Status Enum
CREATE TYPE "Status" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- Task Priority Enum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Users Table
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE "Project" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deadline" TIMESTAMP,
    "status" TEXT DEFAULT 'ACTIVE',
    "createdById" TEXT NOT NULL REFERENCES "User"("id"),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE "Task" (
    "id" TEXT PRIMARY KEY,
    "projectId" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigneeId" TEXT REFERENCES "User"("id"),
    "status" "Status" DEFAULT 'TODO',
    "priority" "Priority" DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Members (Many-to-Many)
CREATE TABLE "_ProjectMembers" (
    "A" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
    "B" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "_ProjectMembers_AB_unique" ON "_ProjectMembers"("A", "B");
CREATE INDEX "_ProjectMembers_B_index" ON "_ProjectMembers"("B");
