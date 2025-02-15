import { Bell } from 'react-bootstrap-icons';
import { NavLink, useParams } from 'react-router-dom';
import * as Avatar from '@radix-ui/react-avatar';

import { Separator } from '@/shared/components/separator';
import JarvisLogo from '@/src/assets/svgs/jarvis-logo-without-text.svg';
import UserDefaultLogo from '@/src/assets/svgs/user-default.svg';
import useTeams from '@/src/hooks/use-teams';
import { TeamRole } from '@/src/libs/constants/team';
import useAppStore from '@/src/store';

import { UserMenu } from '../user-menu';

import NotificationDialog from './components/notification-dialog';
import SwitchTenantBtn from './components/switch-tenant-btn';

const Header = () => {
  const user = useAppStore((state) => state.user);
  const { team } = useParams();
  const { currentTeam } = useTeams();

  return (
    <div className="border-separator flex justify-center border-b px-10 pb-2 pt-3">
      <div className="flex w-full max-w-content flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img src={JarvisLogo} alt="Jarvis Logo" className="h-8" />
          <h1 className="ml-2 text-xl/5 font-bold text-primary-700">Jarvis Helpdesk</h1>
          {team && currentTeam && (
            <div className="ml-20 flex flex-row items-center space-x-6">
              {currentTeam.role === TeamRole.ADMIN && (
                <NavLink
                  to={`/team/${team}/knowledge`}
                  className={({ isActive }) => (isActive ? 'active-tab' : 'inactive-tab')}
                >
                  Knowledge
                </NavLink>
              )}
              <NavLink
                to={`/team/${team}/ai-settings`}
                className={({ isActive }) => (isActive ? 'active-tab' : 'inactive-tab')}
              >
                AI Settings
              </NavLink>
              <NavLink
                to={`/team/${team}/members`}
                className={({ isActive }) => (isActive ? 'active-tab' : 'inactive-tab')}
              >
                Members
              </NavLink>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-around gap-x-6">
          {team && <SwitchTenantBtn />}
          <Separator orientation="vertical" className="h-5" />
          <NotificationDialog>
            <div className="rounded-sm bg-white p-2" id="bell-icon">
              <Bell className="h-4 w-4" />
            </div>
          </NotificationDialog>
          <UserMenu user={user}>
            <Avatar.Root className="inline-flex size-[34px] cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border-2 align-middle">
              <Avatar.Fallback className="leading-1 flex size-full items-center justify-center bg-white text-[14px] font-medium">
                {user?.username?.trim()[0]?.toUpperCase() || 'User'}
              </Avatar.Fallback>
              <Avatar.AvatarImage src={user?.profileImage || UserDefaultLogo} />
            </Avatar.Root>
          </UserMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
