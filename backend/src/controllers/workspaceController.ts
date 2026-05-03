import { Request, Response } from 'express';
import prisma from '../config/db';

type CountRow = { count: bigint | number };
type ProjectTypeRow = { type: string; count: bigint | number };
type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  type: string;
  deadline: Date | null;
  createdAt: Date;
  teamId: string | null;
  teamName: string | null;
  taskCount: bigint | number;
};
type TeamRow = {
  id: string;
  name: string;
  description: string | null;
  leadId: string | null;
  leadName: string | null;
  memberCount: bigint | number;
};

const toNumber = (value: bigint | number): number => Number(value);

export const getWorkspaceOverview = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';

    const activeProjectsQuery = isAdmin
      ? prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Project"
          WHERE "status" = 'ACTIVE'
        `
      : prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Project" p
          WHERE p."status" = 'ACTIVE'
            AND EXISTS (
              SELECT 1
              FROM "_ProjectMembers" pm
              WHERE pm."A" = p."id" AND pm."B" = ${req.user.id}
            )
        `;

    const pendingTasksQuery = isAdmin
      ? prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Task"
          WHERE "status" IN ('TODO', 'IN_PROGRESS')
        `
      : prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Task"
          WHERE "status" IN ('TODO', 'IN_PROGRESS')
            AND "assigneeId" = ${req.user.id}
        `;

    const completedTasksQuery = isAdmin
      ? prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Task"
          WHERE "status" = 'COMPLETED'
        `
      : prisma.$queryRaw<CountRow[]>`
          SELECT COUNT(*)::bigint AS count
          FROM "Task"
          WHERE "status" = 'COMPLETED'
            AND "assigneeId" = ${req.user.id}
        `;

    const projectTypesQuery = isAdmin
      ? prisma.$queryRaw<ProjectTypeRow[]>`
          SELECT p."type"::text AS type, COUNT(*)::bigint AS count
          FROM "Project" p
          GROUP BY p."type"
          ORDER BY count DESC, type ASC
        `
      : prisma.$queryRaw<ProjectTypeRow[]>`
          SELECT p."type"::text AS type, COUNT(*)::bigint AS count
          FROM "Project" p
          WHERE EXISTS (
            SELECT 1
            FROM "_ProjectMembers" pm
            WHERE pm."A" = p."id" AND pm."B" = ${req.user.id}
          )
          GROUP BY p."type"
          ORDER BY count DESC, type ASC
        `;

    const recentProjectsQuery = isAdmin
      ? prisma.$queryRaw<ProjectRow[]>`
          SELECT
            p."id",
            p."name",
            p."description",
            p."status",
            p."type"::text AS "type",
            p."deadline",
            p."createdAt",
            p."teamId",
            t."name" AS "teamName",
            COUNT(task."id")::bigint AS "taskCount"
          FROM "Project" p
          LEFT JOIN "Team" t ON t."id" = p."teamId"
          LEFT JOIN "Task" task ON task."projectId" = p."id"
          GROUP BY p."id", t."name"
          ORDER BY p."createdAt" DESC
          LIMIT 6
        `
      : prisma.$queryRaw<ProjectRow[]>`
          SELECT
            p."id",
            p."name",
            p."description",
            p."status",
            p."type"::text AS "type",
            p."deadline",
            p."createdAt",
            p."teamId",
            t."name" AS "teamName",
            COUNT(task."id")::bigint AS "taskCount"
          FROM "Project" p
          LEFT JOIN "Team" t ON t."id" = p."teamId"
          LEFT JOIN "Task" task ON task."projectId" = p."id"
          WHERE EXISTS (
            SELECT 1
            FROM "_ProjectMembers" pm
            WHERE pm."A" = p."id" AND pm."B" = ${req.user.id}
          )
          GROUP BY p."id", t."name"
          ORDER BY p."createdAt" DESC
          LIMIT 6
        `;

    const [activeProjects, pendingTasks, completedTasks, projectsByType, recentProjects] = await Promise.all([
      activeProjectsQuery,
      pendingTasksQuery,
      completedTasksQuery,
      projectTypesQuery,
      recentProjectsQuery,
    ]);

    res.json({
      success: true,
      data: {
        metrics: {
          activeProjects: toNumber(activeProjects[0]?.count ?? 0),
          pendingTasks: toNumber(pendingTasks[0]?.count ?? 0),
          completedTasks: toNumber(completedTasks[0]?.count ?? 0),
        },
        projectsByType: projectsByType.map((row) => ({
          type: row.type,
          count: toNumber(row.count),
        })),
        recentProjects: recentProjects.map((row) => ({
          ...row,
          taskCount: toNumber(row.taskCount),
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getWorkspaceProjects = async (req: Request, res: Response) => {
  try {
    const isAdmin = req.user.role === 'ADMIN';

    const rows = isAdmin
      ? await prisma.$queryRaw<ProjectRow[]>`
          SELECT
            p."id",
            p."name",
            p."description",
            p."status",
            p."type"::text AS "type",
            p."deadline",
            p."createdAt",
            p."teamId",
            t."name" AS "teamName",
            COUNT(task."id")::bigint AS "taskCount"
          FROM "Project" p
          LEFT JOIN "Team" t ON t."id" = p."teamId"
          LEFT JOIN "Task" task ON task."projectId" = p."id"
          GROUP BY p."id", t."name"
          ORDER BY p."createdAt" DESC
        `
      : await prisma.$queryRaw<ProjectRow[]>`
          SELECT
            p."id",
            p."name",
            p."description",
            p."status",
            p."type"::text AS "type",
            p."deadline",
            p."createdAt",
            p."teamId",
            t."name" AS "teamName",
            COUNT(task."id")::bigint AS "taskCount"
          FROM "Project" p
          LEFT JOIN "Team" t ON t."id" = p."teamId"
          LEFT JOIN "Task" task ON task."projectId" = p."id"
          WHERE EXISTS (
            SELECT 1
            FROM "_ProjectMembers" pm
            WHERE pm."A" = p."id" AND pm."B" = ${req.user.id}
          )
          GROUP BY p."id", t."name"
          ORDER BY p."createdAt" DESC
        `;

    res.json({
      success: true,
      data: rows.map((row) => ({
        ...row,
        taskCount: toNumber(row.taskCount),
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getWorkspaceTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.$queryRaw<TeamRow[]>`
      SELECT
        t."id",
        t."name",
        t."description",
        t."leadId",
        lead."name" AS "leadName",
        COUNT(u."id")::bigint AS "memberCount"
      FROM "Team" t
      LEFT JOIN "User" lead ON lead."id" = t."leadId"
      LEFT JOIN "User" u ON u."teamId" = t."id"
      GROUP BY t."id", lead."name"
      ORDER BY t."createdAt" ASC
    `;

    const teamProjects = await prisma.$queryRaw<Array<{ teamId: string; id: string; name: string; type: string; status: string }>>`
      SELECT
        p."teamId" AS "teamId",
        p."id",
        p."name",
        p."type"::text AS "type",
        p."status"
      FROM "Project" p
      WHERE p."teamId" IS NOT NULL
      ORDER BY p."createdAt" DESC
    `;

    const teamMembers = await prisma.$queryRaw<Array<{ teamId: string; id: string; name: string; email: string; role: string }>>`
      SELECT
        u."teamId" AS "teamId",
        u."id",
        u."name",
        u."email",
        u."role"::text AS "role"
      FROM "User" u
      WHERE u."teamId" IS NOT NULL
      ORDER BY u."createdAt" ASC
    `;

    const projectsByTeam = new Map<string, Array<{ id: string; name: string; type: string; status: string }>>();
    for (const project of teamProjects) {
      const list = projectsByTeam.get(project.teamId) ?? [];
      list.push({ id: project.id, name: project.name, type: project.type, status: project.status });
      projectsByTeam.set(project.teamId, list);
    }

    const membersByTeam = new Map<string, Array<{ id: string; name: string; email: string; role: string }>>();
    for (const member of teamMembers) {
      const list = membersByTeam.get(member.teamId) ?? [];
      list.push({ id: member.id, name: member.name, email: member.email, role: member.role });
      membersByTeam.set(member.teamId, list);
    }

    res.json({
      success: true,
      data: teams.map((team) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        leadId: team.leadId,
        leadName: team.leadName,
        memberCount: toNumber(team.memberCount),
        projects: projectsByTeam.get(team.id) ?? [],
        members: membersByTeam.get(team.id) ?? [],
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
