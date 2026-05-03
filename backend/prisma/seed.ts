import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type PortfolioProject = {
  name: string;
  type: string;
  description: string;
  status: string;
  taskThemes: string[];
};

const portfolioProjects: PortfolioProject[] = [
  {
    name: 'AI MOM',
    type: 'MEETING_INTELLIGENCE',
    description:
      'Real-time meeting transcription, speaker diarization, and AI-generated action items with browser extension support.',
    status: 'ACTIVE',
    taskThemes: ['WebSocket streaming', 'Speaker diarization tuning', 'Summary quality checks', 'Extension UX fixes'],
  },
  {
    name: 'AutoStream Lead Capture Agent',
    type: 'LEAD_AUTOMATION',
    description:
      'Agentic lead qualification workflow with intent classification, RAG grounding, and CRM-ready lead capture.',
    status: 'ACTIVE',
    taskThemes: ['Intent classifier updates', 'Lead extraction prompts', 'Webhook integration', 'Pipeline analytics'],
  },
  {
    name: 'DocuMind',
    type: 'RAG_KNOWLEDGE',
    description: 'Enterprise RAG assistant for documents with source citations and multi-provider fallback.',
    status: 'IN_REVIEW',
    taskThemes: ['Chunking strategy', 'Citation rendering', 'Provider fallback testing', 'FAISS index optimization'],
  },
  {
    name: 'Draftly',
    type: 'EMAIL_AUTOMATION',
    description:
      'Human-in-the-loop email drafting workflow with pause/resume review checkpoints and OAuth integration.',
    status: 'PLANNING',
    taskThemes: ['HITL interruption flow', 'Redraft feedback loop', 'OAuth callback stability', 'Email send retries'],
  },
  {
    name: 'MailBuddy',
    type: 'EMAIL_TRIAGE',
    description:
      'AI-powered email triage and drafting operating system with persistent state and adaptive background sync.',
    status: 'ACTIVE',
    taskThemes: ['Batch classification', 'Adaptive polling', 'Mongo checkpointing', 'Privacy filtering'],
  },
  {
    name: 'RAG Research Assistant',
    type: 'RESEARCH_ASSISTANT',
    description: 'Production RAG research assistant with FastAPI backend, React frontend, and cloud deployment profiles.',
    status: 'ARCHIVED',
    taskThemes: ['Retrieval scoring', 'React dashboard polish', 'Deployment smoke tests', 'API observability'],
  },
  {
    name: 'Clinic NL2SQL Chatbot',
    type: 'NL2SQL_ANALYTICS',
    description: 'Natural-language-to-SQL analytics assistant with safe query guardrails and result visualization.',
    status: 'ACTIVE',
    taskThemes: ['SQL safety rules', 'Prompt robustness', 'Chart generation', 'Latency benchmarking'],
  },
  {
    name: 'LSTM Trading Demo',
    type: 'ALGO_TRADING',
    description: 'Educational LSTM-based forecasting and simulated trading signal generation.',
    status: 'PAUSED',
    taskThemes: ['Feature engineering', 'Model retraining', 'Backtest review', 'Live data adapters'],
  },
  {
    name: 'AI Career Quiz Platform',
    type: 'EDTECH_PLATFORM',
    description: 'Course progression platform with exams, certificates, and payment-enabled course unlocks.',
    status: 'ACTIVE',
    taskThemes: ['Progress unlock rules', 'Question bank curation', 'Payment webhooks', 'Certificate generation'],
  },
];

const teamNamePrefixes = ['Alpha', 'Nova', 'Orbit', 'Pulse', 'Vertex', 'Cipher', 'Helix', 'Atlas'];
const teamDomains = ['ethara.ai', 'ethara.dev', 'ethara.team'];
const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const taskPriorities = ['LOW', 'MEDIUM', 'HIGH'];
const taskVerbs = ['Improve', 'Implement', 'Review', 'Refactor', 'Document', 'Optimize'];

const pickRandom = <T>(items: T[]): T => items[faker.number.int({ min: 0, max: items.length - 1 })];

const buildTaskTitle = (theme: string): string => `${pickRandom(taskVerbs)} ${theme}`;

async function insertUser(params: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}) {
  await prisma.$executeRawUnsafe(
    `INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt")
     VALUES ($1, $2, $3, $4, $5::"Role", NOW())`,
    params.id,
    params.name,
    params.email,
    params.passwordHash,
    params.role,
  );
}

async function main() {
  faker.seed(2026);
  console.log('Seeding database with teams, members, projects, and tasks...');

  await prisma.$executeRawUnsafe('DELETE FROM "Task"');
  await prisma.$executeRawUnsafe('DELETE FROM "_ProjectMembers"');
  await prisma.$executeRawUnsafe('DELETE FROM "Project"');
  await prisma.$executeRawUnsafe('DELETE FROM "Team"');
  await prisma.$executeRawUnsafe('DELETE FROM "User"');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await insertUser({
    id: faker.string.uuid(),
    name: 'Ethara Admin',
    email: 'admin@ethara.com',
    passwordHash: hashedPassword,
    role: 'ADMIN',
  });

  const teamCount = faker.number.int({ min: 5, max: 6 });
  const selectedProjects = faker.helpers.shuffle(portfolioProjects).slice(0, teamCount);

  let createdUsers = 1;
  let createdTasks = 0;
  const createdTeams: string[] = [];

  for (let teamIndex = 0; teamIndex < selectedProjects.length; teamIndex += 1) {
    const projectTemplate = selectedProjects[teamIndex];
    const teamName = `${teamNamePrefixes[teamIndex % teamNamePrefixes.length]} Team ${teamIndex + 1}`;
    const memberTarget = faker.number.int({ min: 7, max: 8 });

    const leadId = faker.string.uuid();
    await insertUser({
      id: leadId,
      name: faker.person.fullName(),
      email: `lead.${teamIndex + 1}.${faker.string.alphanumeric(5).toLowerCase()}@${pickRandom(teamDomains)}`,
      passwordHash: hashedPassword,
      role: 'ADMIN',
    });
    createdUsers += 1;

    const memberIds = [leadId];
    for (let memberIndex = 1; memberIndex < memberTarget; memberIndex += 1) {
      const memberId = faker.string.uuid();
      await insertUser({
        id: memberId,
        name: faker.person.fullName(),
        email: `member.${teamIndex + 1}.${memberIndex}.${faker.string.alphanumeric(4).toLowerCase()}@${pickRandom(teamDomains)}`,
        passwordHash: hashedPassword,
        role: faker.number.int({ min: 1, max: 100 }) <= 12 ? 'ADMIN' : 'MEMBER',
      });
      memberIds.push(memberId);
      createdUsers += 1;
    }

    const teamId = faker.string.uuid();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Team" ("id", "name", "description", "leadId", "createdAt")
       VALUES ($1, $2, $3, $4, NOW())`,
      teamId,
      teamName,
      `${teamName} handles ${projectTemplate.name} delivery and cross-functional coordination.`,
      leadId,
    );

    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "teamId" = $1 WHERE "id" = ANY($2::text[])`,
      teamId,
      memberIds,
    );

    const projectId = faker.string.uuid();
    await prisma.$executeRawUnsafe(
      `INSERT INTO "Project" (
        "id", "type", "name", "description", "deadline", "status", "createdAt", "createdById", "teamId"
      ) VALUES (
        $1, $2::"ProjectType", $3, $4, $5, $6, NOW(), $7, $8
      )`,
      projectId,
      projectTemplate.type,
      projectTemplate.name,
      projectTemplate.description,
      faker.date.soon({ days: 90 }),
      projectTemplate.status,
      leadId,
      teamId,
    );

    for (const memberId of memberIds) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "_ProjectMembers" ("A", "B") VALUES ($1, $2)`,
        projectId,
        memberId,
      );
    }

    const taskCount = faker.number.int({ min: 10, max: 14 });
    for (let taskIndex = 0; taskIndex < taskCount; taskIndex += 1) {
      const theme = projectTemplate.taskThemes[taskIndex % projectTemplate.taskThemes.length];
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Task" (
          "id", "title", "description", "status", "priority", "dueDate", "createdAt", "projectId", "assigneeId"
        ) VALUES (
          $1, $2, $3, $4::"Status", $5::"Priority", $6, NOW(), $7, $8
        )`,
        faker.string.uuid(),
        buildTaskTitle(theme),
        `${theme} work item for ${projectTemplate.name}.`,
        pickRandom(taskStatuses),
        pickRandom(taskPriorities),
        faker.date.soon({ days: 60 }),
        projectId,
        pickRandom(memberIds),
      );
    }

    createdTasks += taskCount;
    createdTeams.push(`${teamName} -> ${projectTemplate.name}`);
  }

  console.log('Seeding finished successfully.');
  console.log('Admin login: admin@ethara.com / password123');
  console.log(`Created users: ${createdUsers}`);
  console.log(`Created teams: ${createdTeams.length}`);
  console.log(`Created tasks: ${createdTasks}`);
  for (const item of createdTeams) {
    console.log(`- ${item}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
