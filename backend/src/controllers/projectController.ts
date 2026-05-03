import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

const projectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  deadline: z.string().optional().transform(val => val ? new Date(val) : undefined),
  status: z.string().optional()
});

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, deadline, status } = projectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline,
        status: status || 'ACTIVE',
        createdById: req.user.id,
        members: {
          connect: { id: req.user.id }
        }
      }
    });

    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: req.user.role === 'ADMIN' ? {} : {
        members: { some: { id: req.user.id } }
      },
      include: {
        createdBy: { select: { name: true, email: true } },
        members: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { tasks: true } }
      }
    });

    res.json({ success: true, data: projects });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: { select: { id: true, name: true, email: true, role: true } },
        tasks: {
          include: { assignedTo: { select: { name: true, email: true } } }
        }
      }
    });

    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });

    // Check access
    const isMember = project.members.some((m: any) => m.id === req.user.id);
    if (req.user.role !== 'ADMIN' && !isMember) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this project' });
    }

    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await prisma.project.update({
      where: { id: projectId },
      data: req.body
    });
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.project.delete({ where: { id: projectId } });
    res.json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        members: { connect: { id: userId } }
      }
    });
    res.json({ success: true, data: project });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
