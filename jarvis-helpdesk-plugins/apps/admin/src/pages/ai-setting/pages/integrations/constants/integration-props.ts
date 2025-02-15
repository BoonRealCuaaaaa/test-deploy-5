import TikTokShopIcon from '@/src/assets/svgs/tiktok.svg';
import ZendeskIcon from '@/src/assets/svgs/zendesk.svg';
import { Integration } from '@/src/libs/constants/integration';

import { IntegrationProp } from '../types/integration-prop';

export const INTEGRATION_PROPS: { [key in Integration]?: IntegrationProp } = {
  [Integration.ZENDESK]: {
    icon: ZendeskIcon,
    platformName: 'Zendesk',
    marketplaceLink:
      'https://www.zendesk.com/marketplace/apps/support/1089481/jarvis-helpdesk-ai-copilot/?queryID=ec51bd6f906d5a280a9fe1d380222b06',
  },
  // [Integration.ZOHODESK]: {
  //   icon: ZohoDeskIcon,
  //   platformName: 'Zohodesk',
  //   marketplaceLink: 'https://marketplace.zoho.com/app/desk',
  // },
  // [Integration.PANCAKE]: {
  //   icon: PancakeIcon,
  //   platformName: 'Pancake V2',
  //   marketplaceLink: 'https://www.zendesk.com/marketplace/',
  // },
  [Integration.TIKTOKSHOP]: {
    icon: TikTokShopIcon,
    platformName: 'Tiktok Shop',
    marketplaceLink: 'https://chromewebstore.google.com/',
  },
};
