import TiktokShopGetDomainGift from '@/src/assets/get-domains-gift/tiktokshop.gif';
import { Integration, NotADomainIntergration } from '@/src/libs/constants/integration';

import { IntegrationGuideProp } from '../types/integration-guide-prop';
import { NotADomainIntergrationProps } from '../types/not-a-domain-integration-props';
export const NotADomainIntergrationText: { [key in NotADomainIntergration]: NotADomainIntergrationProps } = {
  [NotADomainIntergration.TIKTOKSHOP]: {
    integrateBy: 'Shop code',
    hintText: 'Your Tiktok Shop code...',
    domainReplacedBy: 'Shop code',
  },
};

export const INTEGRATION_GUIDE_PROPS: { [key in Integration]: IntegrationGuideProp } = {
  [Integration.TIKTOKSHOP]: {
    getDomainGuideGift: TiktokShopGetDomainGift,
  },
  [Integration.ZENDESK]: {
    getDomainGuideGift: null,
  },
  [Integration.ZOHODESK]: {
    getDomainGuideGift: null,
  },
  [Integration.PANCAKE]: {
    getDomainGuideGift: null,
  },
};
