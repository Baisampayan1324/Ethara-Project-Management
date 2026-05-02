import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });

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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found or access denied.</div>;

  const columns = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
          <p className="text-slate-500 mt-1">{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setShowTaskModal(true)} className="btn btn-primary gap-2">
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(status => (
          <div key={status} className="bg-slate-100 rounded-xl p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 capitalize">{status.replace('_', ' ')}</h3>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {project.tasks.filter((t: any) => t.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {project.tasks.filter((t: any) => t.status === status).map((task: any) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 group">
                  <h4 className="font-semibold text-slate-900 mb-1">{task.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </span>
                    
                    {/* Status Dropdown (Simplified for UI) */}
                    <select 
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded p-1"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input 
                  type="text" required className="input" 
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select className="input" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
