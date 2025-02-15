import { useState } from 'react';

import InnovationAmico from '@/src/assets/svgs/Innovation-amico.svg';

import AddTeamModal from '../modals/add-team-modal';

const TeamEmptyPlaceholder = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <div className="flex flex-col items-center gap-y-6 rounded-xl p-8">
      <img src={InnovationAmico} alt="innovation-amico image" />
      <div className="flex flex-col items-center gap-y-5">
        <h2 className="text-center text-2xl font-semibold">No team yet</h2>
        <AddTeamModal openModal={openAddModal} setOpenModal={setOpenAddModal} />
      </div>
    </div>
  );
};

export default TeamEmptyPlaceholder;
