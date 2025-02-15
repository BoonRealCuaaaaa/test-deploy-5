import { useState } from 'react';
import { Book } from 'react-bootstrap-icons';

import { Button } from '@/src/components/button';
import useTeams from '@/src/hooks/use-teams';
import { TeamRole } from '@/src/libs/constants/team';

import InviteMemberModal from '../modals/invite-member-modal';

const MemberTitle = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { currentTeam } = useTeams();

  return (
    <div className="flex flex-row items-center justify-between pt-5">
      <div>
        <p className="text-xl font-semibold">Members</p>
        <p className="text-base font-normal text-[#4B5675]">Invite members to your team to use its own knowledge</p>
      </div>
      <div className="flex space-x-3">
        <div className="flex flex-1 justify-end">
          <Button variant="light" size="small" className="rounded-md">
            <Book />
            Guides
          </Button>
        </div>
        {currentTeam && currentTeam.role === TeamRole.ADMIN && (
          <InviteMemberModal openModal={openModal} setOpenModal={setOpenModal} />
        )}
      </div>
    </div>
  );
};

export default MemberTitle;
