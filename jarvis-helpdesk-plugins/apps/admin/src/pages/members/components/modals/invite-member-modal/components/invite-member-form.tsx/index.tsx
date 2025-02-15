import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';

import Loader from '@/shared/components/loader';
import { Separator } from '@/shared/components/separator';
import { inviteTeamMemberApi } from '@/src/apis/team.api';
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
import { MutationStatusEnum } from '@/src/libs/constants/mutation-status-tag';

export interface IInviteMemberFormProps {
  setOpenModal: (value: boolean) => void;
}

const InviteMemberForm = ({ setOpenModal }: IInviteMemberFormProps) => {
  const { toast } = useToast();
  const { team } = useParams();
  const formSchema = yup.object().shape({
    email: yup
      .string()
      .max(50, 'Email must be at most 50 characters')
      .email('Please enter an email')
      .required('Email is required'),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  const { mutate: inviteMember, status: inviteMemberStatus } = useMutation({
    mutationFn: inviteTeamMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['member'],
      });
      setOpenModal(false);
      form.reset();

      toast({
        variant: 'success',
        description: <SuccessToastDescription content="Invite successfully" />,
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: <FailToastDescription content="Invite failed" />,
      });
    },
  });

  const onSubmit = ({ email }: yup.InferType<typeof formSchema>) => {
    inviteMember({ teamId: team || '', email: email });
  };

  return (
    <div className="flex flex-col p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            maxLength={50}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <FormInput placeholder="Enter the email to invite..." {...field} />
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
            disabled={inviteMemberStatus === 'pending' ? true : false}
          >
            {inviteMemberStatus === MutationStatusEnum.Pending && <Loader fill="white" size={20} className="mx-2" />}
            Send email to invite
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InviteMemberForm;
