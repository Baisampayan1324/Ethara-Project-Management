import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Calendar, CheckSquare } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', deadline: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', description: '', deadline: '' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-500">Manage your team's active projects.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="card hover:shadow-md transition-shadow group cursor-pointer block">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  project.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckSquare size={16} />
                  <span>{project._count?.tasks || 0} tasks</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 card bg-slate-50 border-dashed">
          <p className="text-slate-500 mb-4">No projects found.</p>
          {user?.role === 'ADMIN' && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              Create your first project
            </button>
          )}
        </div>
      )}

      {/* Simple Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input 
                  type="text" required className="input" 
                  value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="input min-h-[100px]" 
                  value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input 
                  type="date" className="input" 
                  value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
