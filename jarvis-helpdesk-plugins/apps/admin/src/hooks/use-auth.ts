import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/src/apis/auth.api';
import { getToken, removeTokens } from '@/src/libs/utils/get-auth-token';

import { removeTeamData } from '../libs/utils/get-team';
import useAppStore from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useAppStore();

  const [isAuthenticatedBefore, setIsAuthenticatedBefore] = useState(!!getToken());

  const { isLoading, isSuccess, data, isError } = useQuery<{
    data: { id: string; primary_email: string; profile_image_url: string; display_name: string };
  }>({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled: isAuthenticatedBefore,
  });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setUser({
      id: data.data.id,
      email: data.data.primary_email,
      profileImage: data.data.profile_image_url,
      username: data.data.display_name,
    });
    setIsAuthenticated(true);
  }, [isSuccess, data, setUser, setIsAuthenticated]);

  useEffect(() => {
    if (!isError) {
      return;
    }
    setIsAuthenticatedBefore(false);
    removeTokens();
    removeTeamData();
  }, [isError]);

  return { user, isAuthenticated, isLoading, isAuthenticatedBefore };
};
