import { PropsWithChildren, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQuery } from '@tanstack/react-query';

import { Separator } from '@/shared/components/separator';
import { getGettingStartedTasksApi } from '@/src/apis/getting-started.api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/tabs';
import useAppStore from '@/src/store';

import GetStartedTab from './components/get-started-tab';
import { GETTING_STARTED_TASKS_QUERY_KEYS } from './constants/query-keys';
import { TabName } from './constants/tab-name';

const NotificationDialog = ({ children }: PropsWithChildren) => {
  const { team: currentTeamId } = useParams<{ team: string }>();
  const [open, setOpen] = useState(false);
  const [tabName, setTabName] = useState(TabName.ALL_TAB);

  const setJoyrideState = useAppStore((state) => state.setJoyrideState);
  const joyrideState = useAppStore((state) => state.joyrideState);

  const {
    data: gettingStartedTasks,
    isLoading: gettingStartedTasksLoading,
    refetch: gettingStartedTasksRefetch,
  } = useQuery({
    queryKey: [GETTING_STARTED_TASKS_QUERY_KEYS.GETTING_STARTED_TASKS, currentTeamId],
    queryFn: async () => {
      return (await getGettingStartedTasksApi(currentTeamId || '')).data;
    },
  });

  useEffect(() => {
    if (joyrideState.run) {
      setJoyrideState({ stepIndex: joyrideState.stepIndex + 1 });
    }
  }, [open]);

  const isDisplayGettingStartedTab = currentTeamId && gettingStartedTasks && gettingStartedTasks.length > 0;

  useEffect(() => {
    if (!isDisplayGettingStartedTab && tabName === TabName.GET_STARTED_TAB) {
      setTabName(TabName.ALL_TAB);
    }
  }, [isDisplayGettingStartedTab, tabName]);

  if (gettingStartedTasksLoading) {
    return children;
  }

  const onTabValueChange = (value: string) => {
    setTabName(value as TabName);
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger onClick={() => setOpen(true)}>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          id="notification-bell-icon"
          align="end"
          className="mt-3 w-[460px] translate-x-5 rounded-md border bg-white"
        >
          <div className="flex justify-between px-4 py-3">
            <div className="font-semibold">Notifications</div>
          </div>
          <Separator />
          <Tabs onValueChange={onTabValueChange} value={tabName} defaultValue="all" className="max-w-content flex-1">
            <TabsList className="m-0 flex flex-row justify-start px-2">
              <TabsTrigger value={TabName.ALL_TAB}>All</TabsTrigger>
              {isDisplayGettingStartedTab && (
                <TabsTrigger
                  value={TabName.GET_STARTED_TAB}
                  id={TabName.GET_STARTED_TAB}
                  onClick={() => {
                    if (joyrideState.run) {
                      setJoyrideState({ stepIndex: joyrideState.stepIndex + 1 });
                    }

                    setTabName(TabName.GET_STARTED_TAB);
                  }}
                >
                  Get started
                </TabsTrigger>
              )}
            </TabsList>
            <Separator />
            <TabsContent value={TabName.ALL_TAB} className="m-0">
              <div className="flex h-24 w-full items-center justify-center font-semibold text-primary-500">
                Coming soon
              </div>
            </TabsContent>
            {isDisplayGettingStartedTab && (
              <TabsContent value={TabName.GET_STARTED_TAB} className="m-0">
                <GetStartedTab
                  gettingStartedTasks={gettingStartedTasks}
                  gettingStartedTasksRefetch={gettingStartedTasksRefetch}
                  setNotificationDialogOpen={setOpen}
                />
              </TabsContent>
            )}
          </Tabs>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default NotificationDialog;
