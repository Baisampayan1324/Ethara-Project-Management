import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completed: 0,
    overdue: 0
  });
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks/my')
        ]);
        
        const projects = projRes.data.data;
        const tasks = taskRes.data.data;
        
        setStats({
          projects: projects.length,
          tasks: tasks.length,
          completed: tasks.filter((t: any) => t.status === 'COMPLETED').length,
          overdue: tasks.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length
        });
        
        setMyTasks(tasks.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
    <div className="h-64 bg-slate-200 rounded-xl w-full"></div>
  </div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hello, {user?.name} 👋</h2>
          <p className="text-slate-500 mt-2 text-lg">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.projects} icon={Briefcase} color="blue" />
        <StatCard title="My Tasks" value={stats.tasks} icon={Clock} color="amber" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="emerald" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Tasks</h3>
          <div className="space-y-4">
            {myTasks.length > 0 ? myTasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100/80 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-200 group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${task.status === 'COMPLETED' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} />
                  <div>
                    <p className="text-md font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.project.name}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                  task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200/70 text-slate-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 text-md font-medium">You're all caught up!</p>
                <p className="text-slate-400 text-sm mt-1">No pending tasks assigned to you.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-none shadow-2xl shadow-primary-900/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold mb-3">Ready to scale?</h3>
            <p className="text-primary-100 text-md mb-8 leading-relaxed max-w-md">Create a new project and invite your team to start collaborating in real-time. Boost your productivity today.</p>
            <button className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    rose: 'text-rose-600 bg-rose-50'
  };

  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
