import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

type OverviewResponse = {
  metrics: {
    activeProjects: number;
    pendingTasks: number;
    completedTasks: number;
  };
  projectsByType: Array<{ type: string; count: number }>;
  recentProjects: Array<{
    id: string;
    name: string;
    description: string | null;
    status: string;
    type: string;
    deadline: string | null;
    teamName: string | null;
    taskCount: number;
  }>;
};

const formatType = (value: string) => value.toLowerCase().split('_').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ');

const SkeletonCard = () => (
  <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6 animate-pulse">
    <div className="h-3 w-24 bg-[#27272a] rounded mb-4"></div>
    <div className="h-10 w-12 bg-[#27272a] rounded"></div>
  </div>
);

const SkeletonProject = () => (
  <div className="border border-[#27272a] rounded-md p-4 bg-[#030303] animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-5 w-32 bg-[#27272a] rounded"></div>
      <div className="h-4 w-16 bg-[#27272a] rounded"></div>
    </div>
    <div className="h-3 w-20 bg-[#27272a] rounded mb-3"></div>
    <div className="space-y-2">
      <div className="h-3 w-full bg-[#27272a] rounded"></div>
      <div className="h-3 w-2/3 bg-[#27272a] rounded"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await api.get('/workspace/overview');
        if (mounted) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load workspace overview', error);
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

  const metrics = data?.metrics ?? { activeProjects: 0, pendingTasks: 0, completedTasks: 0 };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em]">Dashboard</h2>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-[#767d88]" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading && !data ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
              <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Active Projects</p>
              <p className="text-5xl font-normal tracking-tight">{metrics.activeProjects}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
              <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Pending Tasks</p>
              <p className="text-5xl font-normal tracking-tight">{metrics.pendingTasks}</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
              <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Completed</p>
              <p className="text-5xl font-normal tracking-tight">{metrics.completedTasks}</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6 mb-8">
        <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-4">Project Types</p>
        <div className="flex flex-wrap gap-2">
          {loading && !data ? (
            <div className="h-6 w-32 bg-[#27272a] rounded animate-pulse"></div>
          ) : (
            (data?.projectsByType ?? []).map((row) => (
              <span key={row.type} className="text-[11px] uppercase tracking-[0.35px] px-3 py-1 border border-[#27272a] rounded-md bg-[#030303] text-white">
                {formatType(row.type)}: {row.count}
              </span>
            ))
          )}
          {!loading && (data?.projectsByType?.length ?? 0) === 0 && (
            <span className="text-[13px] text-[#767d88]">No project types available yet.</span>
          )}
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88]">Recent Projects</p>
          <button onClick={() => navigate('/projects')} className="text-[11px] uppercase tracking-[0.35px] text-white hover:text-[#767d88] transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading && !data ? (
            <>
              <SkeletonProject />
              <SkeletonProject />
            </>
          ) : (
            (data?.recentProjects ?? []).map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="text-left border border-[#27272a] hover:border-[#767d88] rounded-md p-4 transition-colors bg-[#030303]"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg tracking-tight leading-tight">{project.name}</h3>
                  <span className="text-[10px] uppercase tracking-[0.35px] px-2 py-1 rounded-sm bg-white text-black">{project.status}</span>
                </div>
                <p className="text-[12px] text-[#767d88] uppercase tracking-[0.35px] mb-2">{formatType(project.type)}</p>
                <p className="text-[13px] text-[#b2b6bd] line-clamp-2">{project.description ?? 'No description'}</p>
                <div className="mt-3 text-[11px] uppercase tracking-[0.35px] text-[#767d88] flex items-center justify-between">
                  <span>{project.teamName ?? 'Unassigned team'}</span>
                  <span>{project.taskCount} Tasks</span>
                </div>
              </button>
            ))
          )}
          {!loading && (data?.recentProjects?.length ?? 0) === 0 && (
            <p className="text-[13px] text-[#767d88]">No recent projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

