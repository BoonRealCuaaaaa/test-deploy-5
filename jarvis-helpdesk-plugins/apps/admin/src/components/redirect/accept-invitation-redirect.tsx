import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { acceptTeamInvitationApi } from '@/src/apis/team.api';
import { MutationStatusEnum } from '@/src/libs/constants/mutation-status-tag';

import FullscreenLoader from '../full-screen-loader';
import FailToastDescription from '../toaster/components/fail-toast-description';
import SuccessToastDescription from '../toaster/components/success-toast-description';
import { toast } from '../toaster/hooks/use-toast';

const AcceptInvitationRedirect = () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { mutate: acceptInvitation, status: AcceptInvitationStatus } = useMutation({
    mutationFn: acceptTeamInvitationApi,
    onSuccess: async () => {
      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Successfully joined by invitation" />,
      });
      navigate(`/team?${params.toString()}`);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Failed to join by invitation" />,
      });
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (code) {
      acceptInvitation(code);
      params.delete('code');
      navigate(`/team?${params.toString()}`);
    } else {
      setIsLoading(false);
    }
  });

  return isLoading || AcceptInvitationStatus === MutationStatusEnum.Pending ? <FullscreenLoader /> : <Outlet />;
};

export default AcceptInvitationRedirect;
