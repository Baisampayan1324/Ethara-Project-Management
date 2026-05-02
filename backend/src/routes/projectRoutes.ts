import express from 'express';
import { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject,
  addMember
} from '../controllers/projectController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(authorize('ADMIN'), createProject);

router.route('/:id')
  .get(getProject)
  .put(authorize('ADMIN'), updateProject)
  .delete(authorize('ADMIN'), deleteProject);

router.post('/:id/members', authorize('ADMIN'), addMember);

export default router;
