import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Separator } from '@/shared/components/separator';
import { Button } from '@/src/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/card';
import { Form, FormControl, FormField, FormInput, FormItem, FormLabel } from '@/src/components/form';
import { Switch } from '@/src/components/switch';
import { Integration, NotADomainIntergration } from '@/src/libs/constants/integration';
import { IIntegrationPlatform } from '@/src/libs/interfaces/ai-setting';

import { GiftGuide } from './components/gift-guide';
import { INTEGRATION_FORM_SIZE } from './constants/integration-form-size';
import { getDomainHintText, getPlatformLabel } from './helper/integration-hint';
const formSchema = yup.object({
  domain: yup.string().required().max(INTEGRATION_FORM_SIZE.MAX_DOMAIN),
});

type FormSchema = yup.InferType<typeof formSchema>;

export interface IntegrationSettingPageProps {
  icon: string | undefined;
  platformType: string;
  platformName: string;
  selectedData: IIntegrationPlatform | undefined;
  marketplaceLink: string;
  onBackClick: () => void;
  onCreateIntegration: ({ data, teamId }: { teamId: string; data: { type: Integration; domain: string } }) => any;
  onUpdateIntegration: ({
    integrationPlatformId,
    data,
  }: {
    integrationPlatformId: string;
    data: { domain?: string; isEnable?: boolean };
  }) => any;
}

const IntegrationSettingPage = ({
  icon,
  platformType,
  platformName,
  selectedData,
  marketplaceLink,
  onBackClick,
  onCreateIntegration,
  onUpdateIntegration,
}: IntegrationSettingPageProps) => {
  const { team: teamId } = useParams<{ team: string }>();

  const data = selectedData;
  const initialDomain = data?.domain.split(`.${platformType.toLowerCase()}.com`)[0] || '';
  const [isEnable, setIsEnable] = useState(!!data?.isEnable);

  useEffect(() => {
    if (data?.isEnable !== undefined) {
      setIsEnable(!!data.isEnable);
    }
  }, [data]);

  const form = useForm<FormSchema>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      domain: initialDomain,
    },
  });

  const onHandleSaveClick = ({ domain }: FormSchema) => {
    let fullDomain = `${domain}`;
    if (!Object.values(NotADomainIntergration).includes(platformType as NotADomainIntergration)) {
      fullDomain += `.${platformType.toLowerCase()}.com`;
    }
    if (data === undefined) {
      onCreateIntegration({
        data: { type: platformType as Integration, domain: fullDomain },
        teamId: teamId || '',
      });
    } else {
      onUpdateIntegration({
        integrationPlatformId: data.id,
        data: {
          domain: fullDomain,
        },
      });
    }
  };

  const onIngrationEnableChange = (checked: boolean) => {
    setIsEnable(checked);
    onUpdateIntegration({
      integrationPlatformId: data?.id || '',
      data: {
        isEnable: checked,
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" onClick={onBackClick} className="w-min gap-x-2 font-semibold">
        <ArrowLeft />
        Back
      </Button>
      <Card className="flex divide-x divide-y-0">
        <div className="flex w-[240px] min-w-[240px] flex-col gap-y-5 p-[30px]">
          <img src={icon} className="size-[46px]" />
          <span className="text-[16px]/[16px] font-medium">{platformName}</span>
        </div>
        <div className="flex-1 divide-y divide-gray-200">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Integration settings</CardTitle>
            {data != undefined && (
              <div className="flex items-center gap-x-2.5">
                <span className="text-[13px]/[14px] text-gray-500">{`Enable ${platformName} integration`}</span>
                <Switch checked={isEnable} onCheckedChange={onIngrationEnableChange} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="mb-3 font-semibold">1. Fill in your {platformName} domain</div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onHandleSaveClick)}
                id="integration-setting-form"
                className="my-8 flex items-center justify-between gap-x-5 gap-y-5"
              >
                <FormField
                  control={form.control}
                  name="domain"
                  maxLength={50}
                  render={({ field }: { field: ControllerRenderProps<FormSchema, 'domain'> }) => (
                    <FormItem className="flex grow flex-row items-center justify-between gap-x-4">
                      <FormLabel className="ml-4 whitespace-nowrap font-normal">
                        {getPlatformLabel(platformType)}
                      </FormLabel>
                      <FormControl>
                        <FormInput placeholder={getDomainHintText(platformType)} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-x-2.5">
                  <Button type="submit" variant="primary" size="medium">
                    {data == undefined ? 'Connect' : 'Save'}
                  </Button>
                </div>
              </form>
            </Form>
            <GiftGuide platformType={platformType} />
            <Separator className="my-5" />
            <div className="mt-8 font-semibold">
              2. Install
              <a className="text-primary-500" id="marketplace-link" target="_blank" href={marketplaceLink}>
                {' '}
                Jarvis Helpdesk AI Copilot{' '}
              </a>{' '}
              in {platformName} marketplace.{' '}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationSettingPage;
