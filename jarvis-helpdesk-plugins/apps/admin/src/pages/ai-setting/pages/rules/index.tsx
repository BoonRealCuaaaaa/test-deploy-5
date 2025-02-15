import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { createDataTableQueryKey } from '@/shared/lib/utils/data-table';
import { addRuleApi, deleteRuleApi, editRuleApi, getRulesWithPaginationApi } from '@/src/apis/rule.api';
import DataTable from '@/src/components/data-table';
import { GETTING_STARTED_TASKS_QUERY_KEYS } from '@/src/components/header/components/notification-dialog/constants/query-keys';
import { Switch } from '@/src/components/switch';
import FailToastDescription from '@/src/components/toaster/components/fail-toast-description';
import SuccessToastDescription from '@/src/components/toaster/components/success-toast-description';
import { useToast } from '@/src/components/toaster/hooks/use-toast';
import { useAssistant } from '@/src/hooks/use-assistant';
import { IRule } from '@/src/libs/interfaces/ai-setting';

import AddRuleForm from './components/add-rule-form';
import DeleteRuleDialog from './components/delete-rule-dialog';
import EditRuleDialog from './components/edit-rule-dialog';
import RuleCard from './components/rule-card';
import RuleTableEmptyPlaceholder from './components/rule-table-empty-placeholder';

const RulePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const assistant = useAssistant();
  const { team: currentTeamId } = useParams<{ team: string }>();
  const [searchParams] = useSearchParams();
  const [ruleInput, setRuleInput] = useState('');

  const queryKey = ['rules', assistant?.id || ''];
  const dataTableQueryKey = createDataTableQueryKey(queryKey, searchParams);

  const { mutate: deleteRuleMutation } = useMutation({
    mutationFn: deleteRuleApi,
    onSuccess: async (response) => {
      if (!response.data.deleted) {
        toast({
          variant: 'destructive',
          description: <FailToastDescription content="Delete rule failed" />,
        });
        return;
      }
      await queryClient.prefetchQuery({
        queryKey: dataTableQueryKey,
      });

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Delete rule successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });
  const { mutate: createRule } = useMutation({
    mutationFn: addRuleApi,
    onSuccess: async () => {
      await queryClient.prefetchQuery({
        queryKey: dataTableQueryKey,
      });

      queryClient.prefetchQuery({ queryKey: [GETTING_STARTED_TASKS_QUERY_KEYS.GETTING_STARTED_TASKS, currentTeamId] });

      setRuleInput('');
      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Create a new rule successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });

  const { mutate: editRuleMutation } = useMutation({
    mutationFn: editRuleApi,
    onSuccess: (response) => {
      if (!response.data.updated) {
        toast({
          variant: 'destructive',
          description: <FailToastDescription content="Edit rule failed" />,
        });
        return;
      }

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Edit rule successfully" />,
      });

      const updatedRule = response.data.rule;
      queryClient.setQueryData(dataTableQueryKey, (oldData: { items: IRule[]; total: number }) => {
        return {
          ...oldData,
          items: oldData.items.map((rule) => (rule.id === updatedRule.id ? updatedRule : rule)),
        };
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Something went wrong" />,
      });
    },
  });

  const onAddRule = () => {
    if (!assistant?.id) {
      return;
    }

    const rule = ruleInput;
    createRule({ data: { content: rule }, assistantId: assistant.id });
  };

  const toggleRuleEnable = (ruleId: string, isEnable: boolean) => {
    editRuleMutation({
      ruleId: ruleId,
      data: { isEnable: isEnable },
    });
  };

  const columns: ColumnDef<IRule>[] = useMemo(
    () => [
      {
        accessorKey: 'content',
        header: ({ column }) => (
          <div className="text-[13px] hover:cursor-pointer" onClick={() => column.toggleSorting()}>
            Content
          </div>
        ),
        cell: ({ row }) => {
          const content: string = row.getValue('content');
          return <div className="line-clamp-2 h-10 break-words text-sm">{[content]}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <button className="text-[13px]" onClick={() => column.toggleSorting()}>
            Last modified
          </button>
        ),
        cell: ({ row }) => <div className="text-left">{new Date(row.getValue('updatedAt')).toLocaleDateString()}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'isEnable',
        header: ({ column }) => (
          <button className="text-[13px]" onClick={() => column.toggleSorting()}>
            Enable
          </button>
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <Switch
            checked={row.original.isEnable}
            onCheckedChange={() => toggleRuleEnable(row.original.id, !row.getValue('isEnable'))}
          />
        ),
      },
      {
        id: 'action',
        header: () => <div className="text-[13px]">Actions</div>,
        cell: ({ row }) => {
          return (
            <div className="flex flex-row">
              <EditRuleDialog
                afterSave={(newContent: string) => {
                  editRuleMutation({
                    ruleId: row.original.id,
                    data: { content: newContent },
                  });
                }}
                content={row.getValue('content')}
              />
              <DeleteRuleDialog
                ruleId={row.original.id}
                content={row.getValue('content')}
                afterDelete={(ruleId: string) => deleteRuleMutation(ruleId)}
              />
            </div>
          );
        },
      },
    ],
    [editRuleMutation, deleteRuleMutation]
  );

  const fetchRules = useCallback(
    async (searchParams: URLSearchParams) => {
      if (!assistant?.id) {
        return { items: [], total: 0 };
      }

      const { data } = await getRulesWithPaginationApi(assistant.id, searchParams);
      return { items: data.items, total: data.total || 0 };
    },
    [assistant]
  );

  return (
    <>
      <div className="mb-8 flex flex-row space-x-9">
        {/* Add new rule */}
        <AddRuleForm onAddRule={onAddRule} ruleInput={ruleInput} setRuleInput={setRuleInput} />
        <RuleCard />
      </div>
      <DataTable
        columns={columns}
        columnWidths={{
          content: '56%',
          updatedAt: '18%',
          isEnable: '13%',
          action: '13%',
        }}
        queryKey={dataTableQueryKey}
        fetchData={fetchRules}
        title={'Rules'}
        pageSize={5}
        searchPlaceholder="Search rules"
        queryParameterMappingToApi={{
          offset: 'offset',
          limit: 'limit',
          query: 'query',
          order: 'order',
        }}
        allowSearch={false}
        allowNumOfRows={false}
        emptyPlaceholder={<RuleTableEmptyPlaceholder />}
      />
    </>
  );
};

export default RulePage;
