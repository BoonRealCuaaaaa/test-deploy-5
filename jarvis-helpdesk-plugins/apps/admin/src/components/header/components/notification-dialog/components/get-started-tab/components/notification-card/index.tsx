import JarvisLogo from '@/src/assets/svgs/jarvis-logo-without-text.svg';
import { Button } from '@/src/components/button';
import { IGettingStartedTask } from '@/src/libs/interfaces/getting-started-task';

interface NotificationCardProps {
  gettingStartedTask: IGettingStartedTask;
  onSkipClick: (gettingStartedTaskId: string) => void;
  onGoToClick: (link: string) => void;
}

const NotificationCard = ({ gettingStartedTask, onSkipClick, onGoToClick }: NotificationCardProps) => {
  return (
    <div className="flex gap-x-3 px-4 py-5">
      <img src={JarvisLogo} alt="Jarvis logo" className="h-8 w-8" />
      <div className="flex flex-col gap-y-3">
        <div className="font-medium">{gettingStartedTask.title}</div>
        <div className="flex gap-x-3">
          <Button variant="light" onClick={() => onSkipClick(gettingStartedTask.id)}>
            Skip
          </Button>
          <Button
            variant="primary"
            onClick={() => onGoToClick(gettingStartedTask.link)}
            className="bg-black text-white hover:bg-gray-700"
          >
            Go to {gettingStartedTask.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
