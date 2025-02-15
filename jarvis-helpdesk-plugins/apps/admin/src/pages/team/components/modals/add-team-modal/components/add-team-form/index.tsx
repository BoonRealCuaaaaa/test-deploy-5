import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';

import Loader from '@/shared/components/loader';
import { Separator } from '@/shared/components/separator';
import { addTeamApi } from '@/src/apis/team.api';
import { Button } from '@/src/components/button';
import {
  Form,
  FormControl,
  FormCounter,
  FormField,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormStatus,
} from '@/src/components/form';
import FailToastDescription from '@/src/components/toaster/components/fail-toast-description';
import SuccessToastDescription from '@/src/components/toaster/components/success-toast-description';
import { useToast } from '@/src/components/toaster/hooks/use-toast';
import queryClient from '@/src/libs/clients/query-client';

export interface IAddTeamFormProps {
  setOpenModal: (value: boolean) => void;
}

const AddTeamForm = ({ setOpenModal }: IAddTeamFormProps) => {
  const { toast } = useToast();
  const formSchema = yup.object().shape({
    name: yup.string().max(50, 'Name must be at most 50 characters').required('Name is required'),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  const { mutate: addTeam, status: addTeamStatus } = useMutation({
    mutationFn: addTeamApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams'],
      });
      setOpenModal(false);
      form.reset();

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Team created successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Team creation failed" />,
      });
    },
  });

  const onSubmit = ({ name }: yup.InferType<typeof formSchema>) => {
    addTeam({ displayName: name });
  };

  return (
    <div className="flex flex-col p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            maxLength={50}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <FormInput placeholder="Your team name..." {...field} />
                </FormControl>
                <FormStatus>
                  <FormMessage />
                  <FormCounter />
                </FormStatus>
              </FormItem>
            )}
          ></FormField>

          <Separator className="my-4" />
          <Button
            variant="primary"
            size="medium"
            className="w-full rounded-lg"
            type="submit"
            disabled={addTeamStatus === 'pending' ? true : false}
          >
            {addTeamStatus === 'pending' && <Loader fill="white" size={20} className="mx-2" />}
            Create new Team
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTeamForm;
