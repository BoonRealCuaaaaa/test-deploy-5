import { NotADomainIntergrationText } from '../../../constants/integration-guide-props';
import { NotADomainIntergrationProps } from '../../../types/not-a-domain-integration-props';

export const getPlatformHint = <K extends keyof NotADomainIntergrationProps>(
  platformType: string,
  property: K,
  defaultPlaceholder: string
) => {
  const result = Object.entries(NotADomainIntergrationText).find(
    ([key, _]: [string, NotADomainIntergrationProps]) => key === platformType
  );
  if (result) {
    const [, value] = result;
    return value[property] ?? defaultPlaceholder;
  }
  return defaultPlaceholder;
};

export const getDomainHintText = (platformType: string) => {
  return getPlatformHint(platformType, 'hintText', 'Your domain...');
};

export const getPlatformLabel = (platformType: string) => {
  return getPlatformHint(platformType, 'integrateBy', 'Domain');
};
