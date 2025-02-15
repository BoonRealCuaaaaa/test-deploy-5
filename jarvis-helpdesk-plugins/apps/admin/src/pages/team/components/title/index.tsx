import { useState } from 'react';
import { Book } from 'react-bootstrap-icons';

import { Button } from '@/src/components/button';

import AddTeamModal from '../modals/add-team-modal';

// import AddKnowledgeModal from '../modals/add-knowledge-modal';

const TeamTitle = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center justify-between pt-5">
      <div>
        <p className="text-xl font-semibold">Team Management</p>
      </div>
      <div className="flex space-x-3">
        <div className="flex flex-1 justify-end">
          <Button variant="light" size="small" className="rounded-md">
            <Book />
            Guides
          </Button>
        </div>
        <AddTeamModal openModal={openModal} setOpenModal={setOpenModal} />
      </div>
    </div>
  );
};

export default TeamTitle;
