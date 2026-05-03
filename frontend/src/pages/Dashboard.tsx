

const Dashboard = () => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em] mb-12">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Active Projects</p>
          <p className="text-5xl font-normal tracking-tight">12</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Pending Tasks</p>
          <p className="text-5xl font-normal tracking-tight">24</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Completed</p>
          <p className="text-5xl font-normal tracking-tight">158</p>
        </div>
      </div>

      <div className="relative bg-[#030303] overflow-hidden rounded-md border border-[#27272a] h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        <img 
          src="/kanban-illustration.png" 
          alt="Dashboard Cover" 
          className="w-full h-full object-cover mix-blend-luminosity opacity-40"
        />
        <div className="absolute bottom-8 left-8 z-20">
          <p className="text-[11px] font-[450] uppercase tracking-[0.35px] text-[#767d88] mb-2">Workspace</p>
          <h3 className="text-2xl leading-[1.0] tracking-tight">Orchestrating creativity across the team.</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
