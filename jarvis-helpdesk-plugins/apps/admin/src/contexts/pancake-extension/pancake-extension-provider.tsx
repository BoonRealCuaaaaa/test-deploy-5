import { ReactNode } from 'react';

import { PancakeExtensionContext, usePancakeExtensionProvider } from './pancake-extension-context';

export type ExtensionProviderProps = {
  children: ReactNode;
};

const PancakeExtensionProvider = (props: ExtensionProviderProps) => {
  const { children } = props;

  const extension = usePancakeExtensionProvider();

  return <PancakeExtensionContext.Provider value={extension}>{children}</PancakeExtensionContext.Provider>;
};

export default PancakeExtensionProvider;
