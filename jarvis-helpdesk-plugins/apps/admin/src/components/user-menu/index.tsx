import { ReactNode } from 'react';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

import UserDefaultLogo from '@/src/assets/svgs/user-default.svg';
import { useLogout } from '@/src/hooks/use-logout';
import { IUser } from '@/src/libs/interfaces/user';

import { Avatar } from '../avatar';
import FullscreenLoader from '../full-screen-loader';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';

export type UserMenuProps = {
  children: ReactNode;
  user?: IUser;
};

export const UserMenu = (props: UserMenuProps) => {
  const { children, user } = props;
  const { logout, isLoading } = useLogout();

  const onLogoutClick = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white">
        <FullscreenLoader />
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-60 bg-background" sideOffset={16}>
        <div className="grid gap-2">
          <div className="flex items-center gap-4 space-y-2">
            <Avatar className="inline-flex size-[32px] cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border-2 align-middle">
              <AvatarFallback className="leading-1 flex size-full items-center justify-center bg-white text-[14px] font-medium">
                {user?.username?.trim()[0]?.toUpperCase() || 'User'}
              </AvatarFallback>
              <AvatarImage src={user?.profileImage || UserDefaultLogo} />
            </Avatar>
            <span className="!mt-0 font-semibold">{user?.username || 'User'}</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-4 space-y-2 rounded-lg py-3 hover:bg-gray-100 hover:text-red-500"
            onClick={onLogoutClick}
          >
            <div className="flex w-8 items-center justify-center">
              <BoxArrowRight className="size-4" />
            </div>
            <span className="!mt-0 font-medium">Logout</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
