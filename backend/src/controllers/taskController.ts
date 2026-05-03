import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
});

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate
      }
    });

    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId, status, assigneeId } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId as string,
        status: status as any,
        assigneeId: assigneeId as string
      },
      include: {
        project: { select: { name: true } },
        assignedTo: { select: { name: true, email: true } }
      }
    });

    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const task = await prisma.task.update({
      where: { id: taskId },
      data: req.body
    });
    res.json({ success: true, data: task });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: req.user.id },
      include: { project: { select: { name: true } } }
    });
    res.json({ success: true, data: tasks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
