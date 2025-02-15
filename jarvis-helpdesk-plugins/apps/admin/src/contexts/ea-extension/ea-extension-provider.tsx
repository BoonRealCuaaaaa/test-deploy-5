import { ReactNode } from 'react';

import { EAExtensionContext, useEAExtension } from './ea-extension-context';

export type ExtensionProviderProps = {
  children: ReactNode;
};

const EAExtensionProvider = (props: ExtensionProviderProps) => {
  const { children } = props;

  const extension = useEAExtension();

  return <EAExtensionContext.Provider value={extension}>{children}</EAExtensionContext.Provider>;
};

export default EAExtensionProvider;
