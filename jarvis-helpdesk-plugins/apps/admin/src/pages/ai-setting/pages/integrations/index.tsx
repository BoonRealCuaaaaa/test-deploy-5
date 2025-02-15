import { useEffect, useRef, useState } from 'react';
import { ACTIONS, CallBackProps, EVENTS, Events, STATUS } from 'react-joyride';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createIntegrationApi, getIntegrationApi, updateIntegrationApi } from '@/src/apis/integration.api';
import FullscreenLoader from '@/src/components/full-screen-loader';
import { GETTING_STARTED_TASKS_QUERY_KEYS } from '@/src/components/header/components/notification-dialog/constants/query-keys';
import FailToastDescription from '@/src/components/toaster/components/fail-toast-description';
import SuccessToastDescription from '@/src/components/toaster/components/success-toast-description';
import { useToast } from '@/src/components/toaster/hooks/use-toast';
import queryClient from '@/src/libs/clients/query-client';
import { Integration } from '@/src/libs/constants/integration';
import useAppStore from '@/src/store';

import IntegrationSetting from './components/integration-setting';
import PlatformCard from './components/platform-card';
import { INTEGRATION_PROPS } from './constants/integration-props';
import { INTEGRATION_QUERY_KEYS } from './constants/query-keys';
import { IntegrationProp } from './types/integration-prop';

const IntegrationsPage = () => {
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<{
    type: string;
    platformName: string;
    icon: string;
    marketplaceLink: string;
  } | null>(null);
  const selectedPlatformRef = useRef(selectedPlatform);

  const { toast } = useToast();
  const { team: teamId } = useParams<{ team: string }>();
  const joyrideState = useAppStore((state) => state.joyrideState);
  const setJoyrideState = useAppStore((state) => state.setJoyrideState);

  useEffect(() => {
    selectedPlatformRef.current = selectedPlatform;
  }, [selectedPlatform]);

  useEffect(() => {
    if (joyrideState.tourActive) {
      setTimeout(() => {
        setJoyrideState({
          run: true,
          steps: [
            {
              target: '#platforms-wrapper',
              content: (
                <div>
                  <div className="font-semibold">You can integrate your AI assisant with these platform.</div>
                  <br />
                  Choose one of these platforms!
                </div>
              ),
              disableBeacon: true,
            },
            {
              target: '#Zendesk #setting-btn',
              content: (
                <div>
                  <div className="font-semibold">Assume that you want to integrate with the Zendesk platform</div>
                  <br />
                  Choose Zendesk platform!
                </div>
              ),
              disableBeacon: true,
              disableOverlayClose: true,
              hideCloseButton: true,
              hideFooter: true,
              placement: 'bottom',
              spotlightClicks: true,
            },
            {
              target: '#integration-setting-form',
              content: (
                <div className="font-semibold">
                  Put your Zendesk domain here and click the Connect button to proceed
                </div>
              ),
              disableBeacon: true,
              spotlightClicks: true,
              disableOverlayClose: true,
            },
            {
              target: '#marketplace-link',
              content: <div className="font-semibold">Install Jarvis Helpdesk AI Copilot in Zendesk marketplace.</div>,
              disableBeacon: true,
            },
            {
              target: '#bell-icon',
              content: <div className="text-center font-semibold">Click here to view the list of instructions</div>,
              disableBeacon: true,
              disableOverlayClose: true,
              hideCloseButton: true,
              hideFooter: true,
              placement: 'bottom',
              spotlightClicks: true,
            },
            {
              target: '#get-started-tab',
              content: <div className="text-center font-semibold">Choose get started tab</div>,
              disableBeacon: true,
              disableOverlayClose: true,
              hideCloseButton: true,
              hideFooter: true,
              placement: 'bottom',
              spotlightClicks: true,
            },
          ],
          handleJoyrideCallback,
          styles: {
            options: {
              zIndex: 10000,
              primaryColor: '#36ACFA',
            },
          },
        });
      }, 400);
    }
  }, [joyrideState.tourActive]);

  useEffect(() => {
    if (isOpenSetting && selectedPlatform && joyrideState.run) {
      setJoyrideState({ run: false });

      setTimeout(() => {
        setJoyrideState({ stepIndex: joyrideState.stepIndex + 1, run: true });
      }, 400);
    }
  }, [isOpenSetting, selectedPlatform]);

  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    const currentPlatform = selectedPlatformRef.current;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setJoyrideState({ run: false, stepIndex: 0, tourActive: false });
    } else if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (nextStepIndex === 1) {
        onBackClick();
        setJoyrideState({ run: false });

        setTimeout(() => {
          setJoyrideState({ stepIndex: nextStepIndex, run: true });
        }, 400);
      } else {
        if (nextStepIndex === 4) {
          openInNewTab(currentPlatform?.marketplaceLink || '');
        }

        setJoyrideState({ stepIndex: nextStepIndex });
      }
    }
  };

  const onSettingClick = ({
    type,
    platformName,
    icon,
    marketplaceLink,
  }: {
    type: string;
    platformName: string;
    icon: string;
    marketplaceLink: string;
  }) => {
    setIsOpenSetting(true);
    setSelectedPlatform({ type, platformName, icon, marketplaceLink });
  };

  const onBackClick = () => {
    setIsOpenSetting(false);
    setSelectedPlatform(null);
  };

  const { mutate: createIntegration } = useMutation({
    mutationFn: createIntegrationApi,
    onSuccess: () => {
      refetchIntegrations();
      queryClient.prefetchQuery({ queryKey: [GETTING_STARTED_TASKS_QUERY_KEYS.GETTING_STARTED_TASKS, teamId] });

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Integrated successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });

  const onCreateIntegration = ({ data, teamId }: { teamId: string; data: { type: Integration; domain: string } }) => {
    createIntegration({ teamId, data });
  };

  const { mutate: updateIntegration } = useMutation({
    mutationFn: updateIntegrationApi,
    onSuccess: (response) => {
      if (!response.data.updated) {
        toast({
          variant: 'destructive',
          description: <FailToastDescription content="Update rule failed" />,
        });
        return;
      }
      refetchIntegrations();
      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Update integration settings successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });

  const {
    data: integrations,
    isLoading: isIntegrationsLoading,
    error: integrationsError,
    isError: isIntegrationsError,
    refetch: refetchIntegrations,
  } = useQuery({
    queryKey: [INTEGRATION_QUERY_KEYS.INTEGRATIONS, teamId],
    queryFn: () => {
      return getIntegrationApi(teamId || '');
    },
  });

  if (isIntegrationsLoading) {
    return <FullscreenLoader />;
  }

  if (isIntegrationsError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-primary-500">I'm so sorry. Something's wrong</h2>
        <p className="text-lg font-medium">{integrationsError.message}</p>
      </div>
    );
  }

  const selectedData = integrations?.data.find((integration) => integration.type === selectedPlatform?.type);

  return (
    <>
      {isOpenSetting && selectedPlatform ? (
        <IntegrationSetting
          onBackClick={onBackClick}
          platformType={selectedPlatform.type}
          selectedData={selectedData}
          icon={selectedPlatform.icon}
          platformName={selectedPlatform.platformName}
          marketplaceLink={selectedPlatform.marketplaceLink}
          onUpdateIntegration={updateIntegration}
          onCreateIntegration={onCreateIntegration}
        />
      ) : (
        <div className="flex w-fit flex-row flex-wrap gap-[28px]" id="platforms-wrapper">
          {Object.entries(INTEGRATION_PROPS).map(([key, value]: [string, IntegrationProp]) => {
            const integrationData = integrations?.data.find(
              (integration) => integration.type.toLowerCase() === key.toLowerCase()
            );

            return (
              <PlatformCard
                key={`${key}-${integrationData?.id}`}
                icon={value.icon}
                platformName={value.platformName}
                onSettingClick={() => {
                  onSettingClick({
                    type: key,
                    icon: value.icon,
                    platformName: value.platformName,
                    marketplaceLink: value.marketplaceLink,
                  });
                }}
                isEnable={!!integrationData?.isEnable}
                id={integrationData?.id || null}
                onUpdateIntegration={updateIntegration}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default IntegrationsPage;
