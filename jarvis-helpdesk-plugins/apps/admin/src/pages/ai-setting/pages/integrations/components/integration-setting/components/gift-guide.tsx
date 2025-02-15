import { useState } from 'react';

import { INTEGRATION_GUIDE_PROPS } from '../../../constants/integration-guide-props';
import { IntegrationGuideProp } from '../../../types/integration-guide-prop';
export const GiftGuide = (props: { platformType: string }) => {
  const [isvisible, setIsVisible] = useState(false);
  let gift;
  const result = Object.entries(INTEGRATION_GUIDE_PROPS).find(
    ([key, _]: [string, IntegrationGuideProp]) => key === props.platformType
  );
  if (result) {
    const [, value] = result;
    gift = value.getDomainGuideGift ?? null;
  }
  return (
    gift && (
      <div>
        <div className="flex items-center justify-end gap-x-2.5">
          <span
            className="cursor-pointer text-[13px]/[14px] italic text-blue-700 underline hover:text-gray-700"
            onClick={() => setIsVisible(!isvisible)}
          >
            {isvisible ? 'Hide' : 'How to get it?'}
          </span>
        </div>
        {isvisible && (
          <div className="flex items-center justify-center gap-x-2.5">
            <img className="max-h-[350px]" src={gift} />
          </div>
        )}
      </div>
    )
  );
};
