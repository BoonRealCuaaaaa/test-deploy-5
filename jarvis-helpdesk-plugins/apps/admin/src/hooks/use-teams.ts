import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import FailToastDescription from '@/src/components/toaster/components/fail-toast-description';

import { getTeamApi } from '../apis/team.api';
import { useToast } from '../components/toaster/hooks/use-toast';
import { TeamKey } from '../libs/constants/team';
import { ITeam } from '../libs/interfaces/team';
import useAppStore from '../store';

const useTeams = () => {
  const { toast } = useToast();
  const { teams, currentTeam, setCurrentTeam, setTeams, isAuthenticated } = useAppStore();
  const { pathname } = useLocation();
  const { team: teamIdInUrl } = useParams();

  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeamApi,
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess) {
      const fetchedTeams = data.data;
      setTeams(fetchedTeams);

      const lastAccessedTeamId = localStorage.getItem(TeamKey.LAST_ACCESSED_TEAM);
      let selectedTeam: ITeam | null = null;

      if (lastAccessedTeamId) {
        selectedTeam = fetchedTeams.find((team) => team.team.id === lastAccessedTeamId) ?? null;
      }
      if (!selectedTeam && fetchedTeams.length > 0) {
        selectedTeam = fetchedTeams[0] ?? null;
        localStorage.setItem(TeamKey.LAST_ACCESSED_TEAM, selectedTeam?.team.id ?? '');
      }
      if (selectedTeam) {
        setCurrentTeam(selectedTeam);
      }
    }
  }, [isSuccess, data, setTeams, setCurrentTeam]);

  useEffect(() => {
    if (isError && isAuthenticated) {
      toast({
        variant: 'destructive',
        description: React.createElement(FailToastDescription, { content: 'Getting teams failed' }),
      });
    }
  }, [isError, toast]);

  useEffect(() => {
    if (teams.length === 0) {
      return;
    }

    if (teamIdInUrl && teamIdInUrl !== currentTeam?.team.id) {
      const selectedTeam = teams.find((team) => team.team.id === teamIdInUrl);
      if (selectedTeam) {
        setCurrentTeam(selectedTeam);
      }
    }
  }, [pathname, teamIdInUrl, teams, currentTeam, setCurrentTeam]);

  return {
    teams,
    currentTeam,
    setCurrentTeam,
    setTeams,
    isLoadingTeams: isLoading,
    isError,
    error: error?.message ?? null,
    refetchTeams: refetch,
  };
};

export default useTeams;
