import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Loader2, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: string;
  projectId: string;
  projectName: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [columns, setColumns] = useState<Record<string, Column>>({
    'TODO': { id: 'TODO', title: 'TODO', taskIds: [] },
    'IN_PROGRESS': { id: 'IN_PROGRESS', title: 'IN PROGRESS', taskIds: [] },
    'COMPLETED': { id: 'COMPLETED', title: 'COMPLETED', taskIds: [] },
  });
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', projectId: '', status: 'TODO' });
  const [projects, setProjects] = useState<any[]>([]);

  const columnOrder = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks/my');
      const fetchedTasks = data.data as Task[];
      
      const tasksMap: Record<string, Task> = {};
      const newColumns = {
        'TODO': { id: 'TODO', title: 'TODO', taskIds: [] as string[] },
        'IN_PROGRESS': { id: 'IN_PROGRESS', title: 'IN PROGRESS', taskIds: [] as string[] },
        'COMPLETED': { id: 'COMPLETED', title: 'COMPLETED', taskIds: [] as string[] },
      };

      fetchedTasks.forEach(task => {
        tasksMap[task.id] = task;
        if (newColumns[task.status]) {
          newColumns[task.status].taskIds.push(task.id);
        }
      });

      setTasks(tasksMap);
      setColumns(newColumns);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/workspace/projects');
      setProjects(data.data);
      if (data.data.length > 0) {
        setNewTask(prev => ({ ...prev, projectId: data.data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'ADMIN') {
      fetchProjects();
    }
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setColumns({ ...columns, [newColumn.id]: newColumn });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });

    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
    } catch (err) {
      console.error('Failed to update task status', err);
      fetchTasks(); // Revert on error
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/tasks', newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', projectId: projects[0]?.id || '', status: 'TODO' });
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#767d88]" />
        <p className="text-[11px] uppercase tracking-[0.35px] text-[#767d88]">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-full space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em]">My Tasks</h2>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowTaskModal(true)} className="btn btn-primary gap-2">
            <Plus size={16} /> New Task
          </button>
        )}
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 h-full flex-1 min-h-[500px]">
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(Boolean);

            return (
              <div key={column.id} className="flex-1 bg-[#030303] border border-[#27272a] rounded-md p-4 flex flex-col">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#27272a]">
                  <h3 className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">
                    {column.title}
                  </h3>
                  <span className="text-[11px] text-white/40">
                    {columnTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[150px] space-y-3 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-white/5 rounded-lg' : ''}`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group bg-[#1a1a1a] border ${snapshot.isDragging ? 'border-white shadow-2xl scale-[1.02]' : 'border-[#27272a]'} p-4 rounded-md transition-all duration-200`}
                            >
                              <p className="text-[10px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">{task.projectName || 'General'}</p>
                              <p className="text-white text-[14px] leading-tight mb-1">{task.title}</p>
                              {task.description && (
                                <p className="text-[12px] text-[#767d88] line-clamp-1">{task.description}</p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1a1a1a] border border-[#27272a] rounded-lg shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-normal tracking-tight">Create New Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-[#767d88] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Project</label>
                <select 
                  className="input appearance-none" 
                  value={newTask.projectId} 
                  onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                  required
                >
                  <option value="" disabled>Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Task Title</label>
                <input 
                  type="text" required className="input" 
                  placeholder="What needs to be done?"
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Priority</label>
                <select className="input appearance-none" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)} 
                  className="px-6 py-2 text-[11px] uppercase tracking-[0.35px] text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary min-w-[140px]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;

