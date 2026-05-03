import { useEffect, useState } from 'react';
import api from '../services/api';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type TeamProject = {
  id: string;
  name: string;
  type: string;
  status: string;
};

type Team = {
  id: string;
  name: string;
  description: string | null;
  leadName: string | null;
  memberCount: number;
  projects: TeamProject[];
  members: TeamMember[];
};

const formatType = (value: string) => value.toLowerCase().split('_').map((x) => x[0].toUpperCase() + x.slice(1)).join(' ');

const Team = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await api.get('/workspace/teams');
        if (mounted) {
          setTeams(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load teams', error);
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
      <h2 className="text-4xl font-normal leading-[1.0] tracking-[-0.03em] mb-12">Team Management</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div key={team.id} className="bg-[#1a1a1a] border border-[#27272a] rounded-md p-6">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-2xl tracking-tight leading-tight">{team.name}</h3>
                <p className="text-[13px] text-[#767d88] mt-1">{team.description ?? 'No description'}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.35px] px-2 py-1 border border-[#27272a] rounded-sm bg-[#030303]">
                {team.memberCount} Members
              </span>
            </div>

            <div className="text-[11px] uppercase tracking-[0.35px] text-[#767d88] mb-3">
              Lead: <span className="text-white">{team.leadName ?? 'Unassigned'}</span>
            </div>

            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-[0.35px] text-[#767d88] mb-2">Projects</p>
              <div className="space-y-2">
                {team.projects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center text-[12px] border border-[#27272a] rounded-md px-3 py-2 bg-[#030303]">
                    <div>
                      <p className="text-white">{project.name}</p>
                      <p className="text-[#767d88] text-[10px] uppercase tracking-[0.35px]">{formatType(project.type)}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.35px] text-[#767d88]">{project.status}</span>
                  </div>
                ))}
                {team.projects.length === 0 && <p className="text-[13px] text-[#767d88]">No projects assigned.</p>}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.35px] text-[#767d88] mb-2">Members</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {team.members.map((member) => (
                  <div key={member.id} className="border border-[#27272a] rounded-md px-3 py-2 bg-[#030303]">
                    <p className="text-[13px] text-white truncate">{member.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.35px] text-[#767d88] truncate">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && teams.length === 0 && <p className="text-[13px] text-[#767d88]">No teams found.</p>}
    </div>
  );
};

export default Team;
