import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { getWorkspaceOverview, getWorkspaceProjects, getWorkspaceTeams } from '../controllers/workspaceController';

const router = express.Router();

router.use(protect);

router.get('/overview', getWorkspaceOverview);
router.get('/projects', getWorkspaceProjects);
router.get('/teams', authorize('ADMIN'), getWorkspaceTeams);

export default router;
