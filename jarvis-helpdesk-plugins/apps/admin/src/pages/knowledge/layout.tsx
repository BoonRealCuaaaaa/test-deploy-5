import { Suspense } from 'react';
import Joyride from 'react-joyride';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getAssistantByTeamId } from '@/src/apis/assistant.api';
import FullscreenLoader from '@/src/components/full-screen-loader';
import OnBoarding from '@/src/components/onboarding';
import useAppStore from '@/src/store';

const KnowledgeLayout = () => {
  const { team } = useParams();

  const setAssistant = useAppStore((state) => state.setAssistant);
  const joyrideState = useAppStore((state) => state.joyrideState);

  const { data: assistant, isLoading: isAssistantLoading } = useQuery({
    queryKey: ['assistant', team],
    queryFn: () => getAssistantByTeamId(team || ''),
  });

  if (isAssistantLoading) {
    return <FullscreenLoader />;
  }

  if (!assistant) {
    return <Navigate to={'/interrupts'} state={{ errorMessage: 'Assistant Not Found' }} />;
  }

  setAssistant(assistant.data);

  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Outlet />
      <OnBoarding />
      <Joyride
        run={joyrideState.run}
        callback={joyrideState.handleJoyrideCallback}
        continuous
        disableScrolling={true}
        locale={{
          nextLabelWithProgress: 'Next ({step} of {steps})',
        }}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={joyrideState.stepIndex}
        steps={joyrideState.steps}
        styles={{ ...joyrideState.styles, overlay: { height: '100%' } }}
      />
    </Suspense>
  );
};

export default KnowledgeLayout;
