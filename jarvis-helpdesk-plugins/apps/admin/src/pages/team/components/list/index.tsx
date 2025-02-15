import { ReactNode, useState } from 'react';
import { Pencil, ThreeDotsVertical, Trash3 } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

import InnovationAmico from '@/src/assets/svgs/Innovation-amico.svg';
import { Card, CardContent } from '@/src/components/card';
import FullscreenLoader from '@/src/components/full-screen-loader';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/popover';
import useTeams from '@/src/hooks/use-teams';
import { TeamRole } from '@/src/libs/constants/team';
import { ITeam } from '@/src/libs/interfaces/team';
import RoleTag from '@/src/pages/members/components/table/components/role-tag';

import DeleteTeamModal from '../modals/delete-team-modal';
import EditTeamModal from '../modals/edit-team-modal';

const TeamList = ({ emptyPlaceholder }: { emptyPlaceholder: ReactNode }) => {
  const navigate = useNavigate();
  const { teams, setCurrentTeam, isLoadingTeams, isError } = useTeams();
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);

  const handleCardClick = (team: ITeam) => {
    setCurrentTeam(team);
    navigate(`/team/${team.team.id}/ai-settings`);
  };

  if (isLoadingTeams) {
    return <FullscreenLoader />;
  }

  if (isError) {
    return (
      <div className="mb-8 flex flex-col items-center gap-y-6 rounded-xl border p-16 shadow-sm">
        <img src={InnovationAmico} alt="innovation-amico image" />
        <h2 className="text-xl font-semibold">No result</h2>
      </div>
    );
  }

  if (teams.length === 0) {
    if (emptyPlaceholder) {
      return emptyPlaceholder;
    }
  }

  return (
    <div className="flex w-full flex-wrap gap-5">
      {teams.map((team) => (
        <Card key={team.team.id} className="shadow">
          <CardContent className="flex w-[300px] flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
              <div
                className="truncate text-[20px] font-semibold leading-normal hover:cursor-pointer hover:underline"
                title={team.team.displayName}
                onClick={() => handleCardClick(team)}
              >
                {team.team.displayName}
              </div>

              {team.role === TeamRole.ADMIN && (
                <>
                  <Popover
                    open={openPopover === team.team.id}
                    onOpenChange={(isOpen) => setOpenPopover(isOpen ? team.team.id : null)}
                  >
                    <PopoverTrigger>
                      <div>
                        <ThreeDotsVertical className="cursor-pointer text-[20px]" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className={`rounded-lg bg-white p-2 shadow-lg`}>
                      <div className="relative inline-block rounded-lg text-left">
                        <div
                          onClick={() => setOpenEditModal(team.team.id)}
                          className="bg-gray flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </div>
                        <div
                          onClick={() => setOpenDeleteModal(team.team.id)}
                          className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 hover:text-red-500"
                        >
                          <Trash3 className="mr-2 h-4 w-4" />
                          <span>Remove</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <DeleteTeamModal
                    id={team.team.id}
                    name={team.team.displayName}
                    openModal={openDeleteModal === team.team.id}
                    onClose={() => setOpenDeleteModal(null)}
                  />
                  <EditTeamModal
                    id={team.team.id}
                    name={team.team.displayName}
                    openModal={openEditModal === team.team.id}
                    onClose={() => setOpenEditModal(null)}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-gray-500">
                Members: <b>{team.totalMembers}</b>
              </div>
              <div className="text-gray-500">
                You are <RoleTag role={team.role} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default TeamList;
