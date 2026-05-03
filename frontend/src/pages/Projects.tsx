

const Projects = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em]">Projects</h2>
        <button className="btn bg-white text-black hover:bg-gray-200 uppercase text-[11px] font-[600] tracking-[0.35px] px-4 py-2">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card hover:border-[#767d88] transition-colors cursor-pointer flex flex-col h-full min-h-[250px]">
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl leading-[1.0] tracking-tight">Website Redesign 2026</h3>
              <span className="text-[10px] uppercase tracking-[0.35px] font-[500] px-2 py-1 bg-white text-black rounded-sm">Active</span>
            </div>
            <p className="text-[#767d88] text-[13px] leading-relaxed">
              Overhaul the corporate website with a modern, fast, and accessible tech stack.
            </p>
          </div>
          <div className="p-4 border-t border-[#27272a] bg-[#030303] flex justify-between items-center text-[11px] uppercase tracking-[0.35px] text-[#767d88]">
            <span>Deadline: 6/3/2026</span>
            <span>4 Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
