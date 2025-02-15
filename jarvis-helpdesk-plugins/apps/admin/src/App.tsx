import { Suspense } from 'react';

import { Toaster } from './components/toaster';
import EAExtensionProvider from './contexts/ea-extension/ea-extension-provider';
import PancakeExtensionProvider from './contexts/pancake-extension/pancake-extension-provider';
import AppRouter from './routes';

import './styles/index.scss';

function App() {
  return (
    <Suspense>
      <EAExtensionProvider>
        <PancakeExtensionProvider>
          <AppRouter />
        </PancakeExtensionProvider>
      </EAExtensionProvider>
      <Toaster />
    </Suspense>
  );
}

export default App;
