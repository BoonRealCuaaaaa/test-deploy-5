import { ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';

import { createDataTableQueryKey } from '@/shared/lib/utils/data-table';
import { getKnowledgeApi } from '@/src/apis/knowledge';
import { Card } from '@/src/components/card';
import DataTable from '@/src/components/data-table';
import { useAssistant } from '@/src/hooks/use-assistant';
import { formatISODate } from '@/src/libs/utils/format-iso-date';

import DeleteKnowledgeModal from '../modals/delete-knowledge-modal';
import EditKnowledgeModal from '../modals/edit-knowledge-modal';

type Knowledge = {
  id: string;
  knowledgeName: string;
  description: string;
  numUnits: number;
  updatedAt: string;
};

const KnowledgeTable = ({ emptyPlaceholder }: { emptyPlaceholder: ReactNode }) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const assistant = useAssistant();

  const dataTableQueryKey = createDataTableQueryKey(['knowledge', assistant?.id || ''], searchParams);

  const fetchKnowledge = async (searchParams: URLSearchParams): Promise<{ items: Knowledge[]; total: number }> => {
    if (!assistant) {
      return { items: [], total: 0 };
    }

    const { data } = await getKnowledgeApi(assistant.id, searchParams);

    return {
      items: data.data.map((item: Knowledge) => ({
        id: item.id,
        knowledgeName: item.knowledgeName,
        description: item.description,
        numUnits: item.numUnits,
        updatedAt: item.updatedAt,
      })),
      total: data.meta.total || 0,
    };
  };

  const handleRowClick = (id: string) => {
    navigate(`${id}`);
  };

  const columns: ColumnDef<Knowledge>[] = [
    {
      accessorKey: 'knowledgeName',
      header: () => <div className="flex text-sm">Name</div>,
      cell: ({ row }) => {
        const { description } = row.original;
        return (
          <div className="flex flex-col gap-y-1 hover:cursor-pointer" onClick={() => handleRowClick(row.original.id)}>
            <div className="line-clamp-2 text-sm font-semibold">{row.getValue('knowledgeName')}</div>
            <div className="line-clamp-2 text-xs text-gray-600">{description}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'numUnits',
      header: () => <div className="flex text-sm">No. Sources</div>,
      cell: ({ row }) => <div className="flex text-sm">{row.getValue('numUnits')}</div>,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }: { column: any }) => (
        <div className="flex text-sm" onClick={() => column.toggleSorting()}>
          Last modified
        </div>
      ),
      cell: ({ row }) => <div className="line-clamp-2 text-sm">{formatISODate(row.getValue('updatedAt'))}</div>,
      enableSorting: true,
    },
    {
      id: 'action',
      header: () => <div className="text-sm">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center space-x-2">
            <EditKnowledgeModal
              id={row.original.id}
              name={row.original.knowledgeName}
              description={row.original.description}
            />
            <DeleteKnowledgeModal knowledgeId={row.original.id} knowledgeName={row.original.knowledgeName} />
          </div>
        );
      },
    },
  ];

  return (
    <Card className="w-full border-b-0">
      <div className="w-full">
        <DataTable
          title="Knowledge"
          columns={columns}
          containHeader={false}
          columnWidths={{
            content: '65%',
            numUnits: '12%',
            updatedAt: '15%',
            action: '8%',
          }}
          queryKey={dataTableQueryKey}
          fetchData={fetchKnowledge}
          pageSize={5}
          searchPlaceholder="Search knowledge"
          queryParameterMappingToApi={{
            offset: 'offset',
            limit: 'limit',
            query: 'query',
            order: 'order',
          }}
          allowSearch={false}
          allowNumOfRows={false}
          emptyPlaceholder={emptyPlaceholder}
        />
      </div>
    </Card>
  );
};

export default KnowledgeTable;
