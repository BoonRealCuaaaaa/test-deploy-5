import { StrictMode, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import ErrorBoundary from '@/shared/components/error-boundary';
import Loader from '@/shared/components/loader';

import { Bootstrap } from '../../bootstrap';
import queryClient from '../../lib/clients/query-client';

import TicketEditorPopover from './components/popover';

import '@/src/app/styles/index.scss';
import '@/shared/modules/response-toolbox/styles/index.css';

const TicketEditor = () => {
  return (
    <StrictMode>
      <Suspense fallback={<Loader />}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <Bootstrap>
              <TicketEditorPopover />
            </Bootstrap>
          </QueryClientProvider>
        </ErrorBoundary>
      </Suspense>
    </StrictMode>
  );
};

export default TicketEditor;
