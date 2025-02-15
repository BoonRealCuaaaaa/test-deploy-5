import { useState } from 'react';
import { ChevronRight } from 'react-bootstrap-icons';
import { ACTIONS, CallBackProps, EVENTS, Events, STATUS } from 'react-joyride';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';

import { getGettingStartedTaskByTaskNameApi } from '@/src/apis/getting-started.api';
import { GettingStartedTaskName } from '@/src/libs/interfaces/getting-started-task';
import useAppStore from '@/src/store';

import jarvisLogo from '../../assets/svgs/jarvis-logo-without-text.svg';
import { Button } from '../button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog';

const OnBoarding = () => {
  const setJoyrideState = useAppStore((state) => state.setJoyrideState);
  const joyrideState = useAppStore((state) => state.joyrideState);

  const [open, setOpen] = useState(!joyrideState.run);

  const navigate = useNavigate();

  const { team: teamId } = useParams();

  const { data: integrationTask, isLoading: integrationTaskLoading } = useQuery({
    queryKey: ['gettings-started-task', GettingStartedTaskName.INTEGRATION],
    queryFn: () =>
      getGettingStartedTaskByTaskNameApi({ teamId: teamId || '', name: GettingStartedTaskName.INTEGRATION }),
  });

  if (integrationTaskLoading || (integrationTask && isEmpty(integrationTask.data))) {
    return; // Don't display the onboarding because the customer already see it
  }

  const handleClickStart = () => {
    setOpen(false);
    setJoyrideState({ tourActive: true });

    const integrationPath = `/team/${teamId}/ai-settings/integrations`;
    navigate(integrationPath);
  };

  const onOpenChange = () => {
    setOpen(!open);
    setJoyrideState({
      run: true,
      steps: [
        {
          target: '#bell-icon',
          content: <div className="text-center font-semibold">Click here to view the list of instructions</div>,
          disableBeacon: true,
          hideCloseButton: true,
          hideFooter: true,
          placement: 'bottom',
          spotlightClicks: true,
        },
        {
          target: '#get-started-tab',
          content: <div className="text-center font-semibold">Choose get started tab</div>,
          disableBeacon: true,
          hideCloseButton: true,
          hideFooter: true,
          placement: 'bottom',
          spotlightClicks: true,
        },
      ],
      styles: {
        options: {
          zIndex: 10000,
          primaryColor: '#36ACFA',
          overlayColor: 'rgba(255, 255, 255, 0.1)',
        },
        overlay: {
          maxHeight: '100%',
        },
        spotlight: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
      handleJoyrideCallback: (data: CallBackProps) => {
        const { action, index, status, type } = data;

        if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
          setJoyrideState({ run: false, stepIndex: 0 });
        } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
          const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

          if (nextStepIndex === 1) {
            setJoyrideState({ stepIndex: nextStepIndex });
          }
        }
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="flex h-fit flex-col items-start gap-y-3 p-5">
            <DialogTitle>
              <img src={jarvisLogo} alt="jarvis logo" />
            </DialogTitle>
            <DialogDescription className="text-[22px] font-semibold">Welcome to Jarvis Helpdesk 👋</DialogDescription>
            <DialogDescription className="text-sm">✨ Enhance your customer care efforts with AI✨</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 p-5">
            <div className="rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 px-3 py-4">
              <div className="mb-2 text-sm font-semibold">🚀 Get started</div>
              <div className="text-[13px]">
                To start using Jarvis Helpdesk, please set up the integration with your helpdesk platform.
              </div>
            </div>
            <div className="flex justify-end">
              <Button id="home" type="submit" variant="primary" onClick={handleClickStart}>
                Go to Integrations <ChevronRight />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnBoarding;
