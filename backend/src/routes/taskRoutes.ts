import express from 'express';
import { 
  createTask, 
  getTasks, 
  updateTask, 
  deleteTask,
  getMyTasks
} from '../controllers/taskController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(authorize('ADMIN'), createTask);

router.get('/my', getMyTasks);

router.route('/:id')
  .put(updateTask)
  .delete(authorize('ADMIN'), deleteTask);

export default router;
