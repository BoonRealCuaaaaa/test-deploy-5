import { Book } from 'react-bootstrap-icons';
import { NavLink, useParams } from 'react-router-dom';

import { Button } from '@/src/components/button';
import { Toaster } from '@/src/components/toaster';
import useTeams from '@/src/hooks/use-teams';
import { TeamRole } from '@/src/libs/constants/team';

import { NAV_TABS } from './constants/nav-tabs';

const AiSettingTabs = () => {
  const { team } = useParams();
  const { currentTeam } = useTeams();
  const baseUrl = `/team/${team}/ai-settings/`;

  if (!currentTeam) {
    return null;
  }

  return (
    <div className="mb-10 flex w-full items-stretch justify-center border-b pt-[14px]">
      <div className="flex gap-x-7">
        {NAV_TABS.map(({ title, link }: { title: string; link: string }) => {
          if (title == 'General' || currentTeam.role === TeamRole.ADMIN) {
            return (
              <NavLink
                key={link}
                end
                to={baseUrl + link}
                className={({ isActive }) =>
                  isActive
                    ? 'flex h-full items-center border-b-2 border-primary-500 pb-2 text-sm text-primary-500'
                    : 'flex h-full items-center pb-2 text-sm text-gray-800'
                }
              >
                {title}
              </NavLink>
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="flex flex-1 justify-end pb-3">
        <Button variant="light" size="small" className="gap-x-1">
          <Book />
          Guides
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export default AiSettingTabs;
