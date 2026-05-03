import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, X, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface Project {
  id: string;
  name: string;
  description: string;
  type: string;
  teamName: string;
  tasks: Task[];
}

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (err) {
      console.error('Failed to fetch project', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as Task['status'];
    
    // Optimistic update
    if (project) {
      const updatedTasks = project.tasks.map(t => 
        t.id === draggableId ? { ...t, status: newStatus } : t
      );
      setProject({ ...project, tasks: updatedTasks });
    }

    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status', err);
      // Revert on error
      fetchProjectDetails();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
      fetchProjectDetails();
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
        <p className="text-[11px] uppercase tracking-[0.35px] text-[#767d88]">Loading project intelligence...</p>
      </div>
    );
  }

  if (!project) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-[#767d88]">Project not found or access denied.</p>
    </div>
  );

  const columns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <div className="animate-fade-in space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em]">{project.name}</h2>
            <span className="text-[10px] uppercase tracking-[0.35px] px-2 py-1 bg-white text-black rounded-sm">{project.type.replace('_', ' ')}</span>
          </div>
          <p className="text-[#767d88] text-sm max-w-2xl">{project.description}</p>
          <p className="text-[11px] uppercase tracking-[0.35px] text-white/60">Team: <span className="text-white">{project.teamName || 'Unassigned'}</span></p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowTaskModal(true)} className="btn btn-primary gap-2">
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
          {columns.map(status => (
            <div key={status} className="flex-1 bg-[#030303] border border-[#27272a] rounded-md p-4 flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#27272a]">
                <h3 className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">
                  {status.replace('_', ' ')}
                </h3>
                <span className="text-[11px] text-white/40">
                  {project.tasks.filter(t => t.status === status).length}
                </span>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-white/5 rounded-lg' : ''}`}
                  >
                    {project.tasks
                      .filter(t => t.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group bg-[#1a1a1a] border ${snapshot.isDragging ? 'border-white shadow-2xl scale-[1.02]' : 'border-[#27272a]'} p-4 rounded-md transition-all duration-200`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-[14px] font-medium text-white leading-tight">{task.title}</h4>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                                  task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 
                                  task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' :
                                  'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#767d88] line-clamp-2 leading-relaxed">
                                {task.description || 'No description provided.'}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
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
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Task Title</label>
                <input 
                  type="text" required className="input" 
                  placeholder="What needs to be done?"
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Description</label>
                <textarea 
                  className="input min-h-[100px] resize-none" 
                  placeholder="Optional details..."
                  value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Priority</label>
                <select className="input appearance-none" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})}>
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

export default ProjectDetail;

