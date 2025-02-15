import { ChevronDown } from 'react-bootstrap-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/src/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupTitle,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/dropdown-menu';
import useTeams from '@/src/hooks/use-teams';
import { ITeam } from '@/src/libs/interfaces/team';

const SwitchTenantBtn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { team: currentTeamId } = useParams<{ team: string }>();

  const { teams, setCurrentTeam } = useTeams();

  const currentTeam = teams.find((team) => team.team.id === currentTeamId);

  const handleSwitchTeam = (team: ITeam) => {
    if (team.team.id === currentTeamId) return;

    setCurrentTeam(team);
    const path = location.pathname.replace(/^\/team\/[^/]+/, `/team/${team.team.id}`);
    navigate(path);
  };

  const handleManageTeamsBtn = () => {
    navigate('/team');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm/[14px] font-medium text-primary-950">
          {currentTeam?.team.displayName ?? 'Select Team'} <ChevronDown className="text-gray-500" size={8} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuGroup>
          <DropdownMenuGroupTitle>Switch to</DropdownMenuGroupTitle>
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.team.id}
              onClick={() => handleSwitchTeam(team)}
              disabled={team.team.id === currentTeamId}
            >
              <span>{team.team.displayName}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Button className="w-full" onClick={handleManageTeamsBtn}>
            Manage Teams
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SwitchTenantBtn;
