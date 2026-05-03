
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  type: string;
  deadline: string | null;
  teamName: string | null;
  taskCount: number;
};

const formatType = (value: string) => value.toLowerCase().split('_').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ');

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await api.get('/workspace/projects');
        if (mounted) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load projects', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    const interval = setInterval(load, 15000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em]">Projects</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-left card hover:border-[#767d88] transition-colors cursor-pointer flex flex-col h-full min-h-[250px]"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4 gap-3">
                <h3 className="text-xl leading-[1.0] tracking-tight">{project.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.35px] font-[500] px-2 py-1 bg-white text-black rounded-sm">
                  {project.status}
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.35px] text-[#767d88] mb-2">{formatType(project.type)}</p>
              <p className="text-[#767d88] text-[13px] leading-relaxed line-clamp-3">{project.description ?? 'No description provided.'}</p>
            </div>
            <div className="p-4 border-t border-[#27272a] bg-[#030303] flex justify-between items-center text-[11px] uppercase tracking-[0.35px] text-[#767d88]">
              <span>{project.teamName ?? 'Unassigned Team'}</span>
              <span>{project.taskCount} Tasks</span>
            </div>
          </button>
        ))}

        {!loading && projects.length === 0 && (
          <p className="text-[13px] text-[#767d88]">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
