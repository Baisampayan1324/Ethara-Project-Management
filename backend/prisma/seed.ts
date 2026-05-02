import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data to prevent duplicate errors
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@ethara.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  const memberUser = await prisma.user.create({
    data: {
      name: 'Team Member',
      email: 'member@ethara.com',
      passwordHash: hashedPassword,
      role: 'MEMBER',
    },
  });

  console.log('Users created:', { admin: adminUser.email, member: memberUser.email });

  // Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign 2026',
      description: 'Overhaul the corporate website with a modern, fast, and accessible tech stack.',
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
      createdById: adminUser.id,
      members: {
        connect: [{ id: adminUser.id }, { id: memberUser.id }],
      },
    },
  });

  console.log('Project created:', project.name);

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Design UI Mockups',
        description: 'Create high-fidelity mockups in Figma for the new landing page.',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project.id,
        assigneeId: memberUser.id,
      },
      {
        title: 'Setup Backend Schema',
        description: 'Define PostgreSQL schema using Prisma for the new dashboard features.',
        status: 'COMPLETED',
        priority: 'HIGH',
        projectId: project.id,
        assigneeId: adminUser.id,
      },
      {
        title: 'Implement Authentication',
        description: 'Add JWT based authentication and role-based access control.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project.id,
        assigneeId: memberUser.id,
      },
      {
        title: 'Write Deployment Scripts',
        description: 'Configure railway.json for 1-click deployments.',
        status: 'TODO',
        priority: 'LOW',
        projectId: project.id,
        assigneeId: adminUser.id,
      }
    ],
  });

  console.log('Tasks created successfully.');
  console.log('Seeding finished! Login with email: admin@ethara.com, password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
