import { Suspense } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getAssistantByTeamId } from '@/src/apis/assistant.api';
import FullscreenLoader from '@/src/components/full-screen-loader';
import useAppStore from '@/src/store';

const MemberLayout = () => {
  const { team } = useParams();

  const setAssistant = useAppStore((state) => state.setAssistant);

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
    </Suspense>
  );
};

export default MemberLayout;
