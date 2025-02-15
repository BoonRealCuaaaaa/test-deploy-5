import { XLg } from 'react-bootstrap-icons';
import * as Dialog from '@radix-ui/react-alert-dialog';

import { Separator } from '@/shared/components/separator';

import EditTeamForm from './components/edit-team-form';

interface EditTeamModalProps {
  id: string;
  name: string;
  openModal: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

const EditTeamModal = ({ id, name, openModal, onClose }: EditTeamModalProps) => {
  return (
    <Dialog.Root open={openModal} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-10" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 h-fit w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white">
          <Dialog.Title className="flex items-center justify-between p-4">
            <p className="text-sm font-semibold">Edit team</p>
            <Dialog.Cancel asChild>
              <button>
                <XLg size={18} />
              </button>
            </Dialog.Cancel>
          </Dialog.Title>
          <Separator className="w-full" />
          <Dialog.Description asChild>
            <EditTeamForm id={id} setOpenModal={onClose} name={name} />
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditTeamModal;
