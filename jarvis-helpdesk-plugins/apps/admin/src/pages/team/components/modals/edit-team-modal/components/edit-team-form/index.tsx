import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';

import Loader from '@/shared/components/loader';
import { Separator } from '@/shared/components/separator';
import { updateTeamApi } from '@/src/apis/team.api';
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

export interface IEditTeamFormProps {
  id: string;
  name: string;
  setOpenModal: (value: boolean) => void;
}

const EditTeamForm = ({ id, name, setOpenModal }: IEditTeamFormProps) => {
  const { toast } = useToast();
  const formSchema = yup.object().shape({
    name: yup.string().max(50, 'Name must be at most 50 characters').required('Name is required'),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const { mutate: editTeam, status: editTeamStatus } = useMutation({
    mutationFn: updateTeamApi,
    onSuccess: () => {
      setOpenModal(false);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      form.reset();

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Team edited successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Team edited failed" />,
      });
    },
  });

  const onSubmit = (values: yup.InferType<typeof formSchema>) => {
    editTeam({ teamId: id, displayName: values.name });
  };

  return (
    <div className="flex flex-col p-5">
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
                  <FormInput placeholder="Your Team name..." {...field} />
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
            disabled={editTeamStatus === 'pending' ? true : false}
          >
            {editTeamStatus === 'pending' && <Loader fill="white" size={20} className="mx-2" />}
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditTeamForm;
