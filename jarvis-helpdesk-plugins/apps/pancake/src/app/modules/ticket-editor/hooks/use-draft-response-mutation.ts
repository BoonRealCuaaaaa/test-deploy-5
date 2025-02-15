import { useMutation } from '@tanstack/react-query';

import { Action } from '@/shared/modules/response-toolbox/constants/action';
import { ActionStatus } from '@/shared/modules/response-toolbox/constants/action-status';
import { ActionAPIResult } from '@/shared/modules/response-toolbox/types/action-api-result';
import { PancakeAPIs } from '@/src/app/apis/pancake-apis';
import { removeHtmlTags } from '@/src/app/lib/utils/remove-html-tags';

import { ErrorMessage } from '../constants/error-message';
import { TicketEditorLoadingValue } from '../constants/ticket-editor-loading-value';

const useDraftResponseMutation = (
  setActionStatus: (status: ActionStatus) => void,
  setActiveAction: (action: Action) => void,
  setResult: (result: ActionAPIResult) => void,
  setIsReDraft: (state: boolean) => void,
  setIsPopoverOpen: (state: boolean) => void,
  getCurrentHistory: () => Promise<{
    past: string[];
    present: string;
    future: string[];
  }>,
  updateCurrentHistory: (newHistory: { past: string[]; present: string; future: string[] }) => void
) => {
  return useMutation({
    mutationFn: async (signal: AbortSignal) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 3000);
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error(ErrorMessage.ABORTED));
        });
      });
      return { response: 'Draft response saved' };
    },
    onMutate: async () => {
      setActionStatus(ActionStatus.WORKING);
      setActiveAction(Action.DRAFT_RESPONSE);
      const oldComment = await PancakeAPIs.getComment();
      PancakeAPIs.setComment(TicketEditorLoadingValue.GENERATING);
      return { oldComment };
    },
    onSuccess: async (result) => {
      setActionStatus(ActionStatus.SUCCESS);
      await PancakeAPIs.setComment(result.response);
      setTimeout(() => {
        setActionStatus(ActionStatus.NONE);
        setIsPopoverOpen(false);
      }, 1000);

      setResult({ response: result.response });
      updateCurrentHistory({
        ...getCurrentHistory(),
        past: [...(await getCurrentHistory()).past, (await getCurrentHistory()).present],
        present: result.response,
        future: [],
      });
      setIsReDraft(true);
    },
    onError: async (error, variables, context) => {
      if (context && error.message !== ErrorMessage.ABORTED) {
        const { oldComment } = context;
        const givenText = await PancakeAPIs.getComment();
        if (removeHtmlTags(givenText) === TicketEditorLoadingValue.GENERATING) {
          PancakeAPIs.setComment(oldComment !== TicketEditorLoadingValue.GENERATING ? oldComment : '');
        }
        setActionStatus(ActionStatus.FAILED);
        setTimeout(async () => {
          setActionStatus(ActionStatus.NONE);
          setIsPopoverOpen(false);
        }, 1000);
        setResult({ errorMsg: error.message });
      }
    },
  });
};

export default useDraftResponseMutation;
