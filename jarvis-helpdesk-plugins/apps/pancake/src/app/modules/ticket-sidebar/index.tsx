import { Separator } from '@/shared/components/separator';
import TicketSidebarHeader from '@/shared/modules/ticket-sidebar/components/header';
import TicketSidebarMain from '@/shared/modules/ticket-sidebar/components/main';

import onActionClickTest from '../../lib/helpers/test';
import useAppStore from '../../stores';

import Onboarding from './components/onboarding';

import '@/shared/styles/index.css';

const TicketSidebar = () => {
  const isAutoResponseEnabled = false;

  async function handleToggleDraftResponseSetting(_checked: boolean): Promise<void> {
    await onActionClickTest();
  }

  const data = {
    summary: "The customer Khiem inquired about the price of a Gucci Men's loafer with Horsebit.",
    sentiment: {
      tone: 'Normal',
      satisfaction: 'Neutral',
      purchasing_potential: 'Low',
      agent_tone: 'Enthusiastic',
      urgency: 'Normal',
    },
    commentsCount: 5,
    averageResponseTime: 120,
    lastMessageTime: '2023-10-01T12:00:00Z',
    purchasingPotential: { rating: 'Low', reason: 'Low purchasing potential' },
  };

  const { isLogin, isRegisteredDomain } = useAppStore((state) => state);

  if (!isLogin || !isRegisteredDomain) {
    return <Onboarding />;
  }

  return (
    <div className="flex flex-col space-y-3 bg-white px-2">
      <Separator />
      <TicketSidebarHeader
        label="Auto response"
        checked={isAutoResponseEnabled}
        description="Automatically draft a response when entering this site or receiving a new message from client."
        onCheckedChange={handleToggleDraftResponseSetting}
      />
      <Separator />
      <TicketSidebarMain
        summary={data.summary}
        sentiment={!data.sentiment}
        commentsCount={Number(data.commentsCount) || 0}
        averageResponseTime={String(data.averageResponseTime || 0)}
        lastMessageTime={String(data.lastMessageTime || new Date().toISOString())}
        purchasingPotential={data.purchasingPotential}
      />
    </div>
  );
};

export default TicketSidebar;
