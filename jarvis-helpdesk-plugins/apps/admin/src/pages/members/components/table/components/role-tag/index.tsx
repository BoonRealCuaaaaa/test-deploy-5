import { TeamRole } from '@/src/libs/constants/team';

type RoleTagStyleProps = {
  background: string;
  text: string;
  border: string;
};

const ROLE_TAG_STYLE_PROPS: { [key in TeamRole]: RoleTagStyleProps } = {
  [TeamRole.ADMIN]: {
    background: 'bg-green-100',
    text: 'text-green-500',
    border: 'border border-green-500',
  },
  [TeamRole.MEMBER]: {
    background: 'bg-blue-100',
    text: 'text-blue-500',
    border: 'border border-blue-500',
  },
};

type RoleTagProps = {
  role: string;
};

const RoleTag = ({ role }: RoleTagProps) => {
  const roleKey = Object.values(TeamRole).includes(role as TeamRole) ? (role as TeamRole) : undefined;

  if (!roleKey) return null;

  const style = ROLE_TAG_STYLE_PROPS[roleKey];
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold ${style.background} ${style.border} ${style.text} rounded-full`}
    >
      {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
    </span>
  );
};

export default RoleTag;
