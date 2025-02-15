import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import { createDataTableQueryKey } from '@/shared/lib/utils/data-table';
import { getTeamMemberApi } from '@/src/apis/team.api';
import { Card } from '@/src/components/card';
import DataTable from '@/src/components/data-table';
import { TeamRole } from '@/src/libs/constants/team';
import { getInitials } from '@/src/libs/utils/create-initial-avatar';
import { convertEmailToName } from '@/src/libs/utils/email-to-name';

import RemoveMemberModal from '../modals/delete-member-modal';

import RoleTag from './components/role-tag';

type Member = {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  role: string;
};

const MemberTable = () => {
  const [searchParams] = useSearchParams();
  const { team } = useParams();
  const dataTableQueryKey = createDataTableQueryKey(['members'], searchParams);
  const [role, setRole] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const fetchMember = async (searchParams: URLSearchParams): Promise<{ items: Member[]; total: number }> => {
    const { data } = await getTeamMemberApi(team || '', searchParams);
    setRole(data.role);
    setCurrentUserId(data.current_user_id);

    return {
      items: data.items.map((item) => ({
        id: item.userId,
        role: item.role,
        name: item.display_name ?? convertEmailToName(item.email),
        profileImageUrl: item.profile_image_url ?? '',
        email: item.email,
      })),
      total: data.total || 0,
    };
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'name',
      header: () => <div className="flex text-sm">Name</div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4">
            {row.original.profileImageUrl === '' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {getInitials(row.original.email)}
              </div>
            ) : (
              <img className="h-10 w-10 rounded-full" src={row.original.profileImageUrl} alt="" />
            )}
            <div className="line-clamp-2 text-sm font-semibold">{row.getValue('name')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: () => <div className="flex text-sm">Email</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-y-1">
            <div className="line-clamp-2 text-xs text-gray-600">{row.getValue('email')}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: () => <div className="flex text-sm">Role</div>,
      cell: ({ row }) => {
        return <RoleTag role={row.getValue('role')} />;
      },
    },
    {
      id: 'action',
      header: () => <div className="text-sm">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center space-x-2">
            {role === TeamRole.ADMIN && row.original.id !== currentUserId && (
              <RemoveMemberModal
                memberID={row.original.id}
                memberName={row.original.name}
                memberEmail={row.original.email}
                memberImage={row.original.profileImageUrl}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="w-full border-b-0">
      <div className="w-full">
        <DataTable
          title="Members"
          columns={columns}
          containHeader={false}
          columnWidths={{
            name: '40%',
            email: '37%',
            role: '15%',
            action: '8%',
          }}
          queryKey={dataTableQueryKey}
          fetchData={fetchMember}
          pageSize={5}
          searchPlaceholder="Search members"
          queryParameterMappingToApi={{
            offset: 'offset',
            limit: 'limit',
            query: 'query',
            order: 'order',
          }}
          allowSearch={false}
          allowNumOfRows={false}
        />
      </div>
    </Card>
  );
};

export default MemberTable;
