import { useNavigate } from 'react-router-dom';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { useMutation } from '@tanstack/react-query';

import { deleteGettingStartedTaskApi } from '@/src/apis/getting-started.api';
import FailToastDescription from '@/src/components/toaster/components/fail-toast-description';
import SuccessToastDescription from '@/src/components/toaster/components/success-toast-description';
import { useToast } from '@/src/components/toaster/hooks/use-toast';
import { IGettingStartedTask } from '@/src/libs/interfaces/getting-started-task';

import NotificationCard from './components/notification-card';

interface GetStartedTabProps {
  gettingStartedTasks: IGettingStartedTask[];
  gettingStartedTasksRefetch: () => void;
  setNotificationDialogOpen: (open: boolean) => void;
}

const GetStartedTab = ({
  gettingStartedTasks,
  gettingStartedTasksRefetch,
  setNotificationDialogOpen,
}: GetStartedTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { mutate: skipTask } = useMutation({
    mutationFn: deleteGettingStartedTaskApi,
    onSuccess: async (response) => {
      if (!response.data.deleted) {
        toast({
          variant: 'destructive',
          description: <FailToastDescription content="Skip failed" />,
        });
        return;
      }
      await gettingStartedTasksRefetch();

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Skip successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });

  const handleGoToButtonClick = (link: string) => {
    setNotificationDialogOpen(false);
    navigate(link);
  };

  return (
    <>
      {gettingStartedTasks.map((gettingStartedTask: IGettingStartedTask, index: number) => (
        <div key={gettingStartedTask.id}>
          <NotificationCard
            onGoToClick={handleGoToButtonClick}
            onSkipClick={skipTask}
            gettingStartedTask={gettingStartedTask}
          />
          {index < gettingStartedTasks.length - 1 && <Separator />}
        </div>
      ))}
    </>
  );
};

export default GetStartedTab;
