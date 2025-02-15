import { Action } from "@/shared/modules/response-toolbox/constants/action";
import { ActionStatus } from "@/shared/modules/response-toolbox/constants/action-status";
import { ActionAPIResult } from "@/shared/modules/response-toolbox/types/action-api-result";
import { useMutation } from "@tanstack/react-query";
import { convertResponseFormatForLiveChat } from "../helpers/convert-response-format-for-live-chat";
import { PancakeAPIs } from "@/src/app/apis/pancake-apis";
import { ErrorMessage } from "../constants/error-message";
import { removeHtmlTags } from "@/src/app/lib/utils/remove-html-tags";
import { TicketEditorLoadingValue } from "../constants/ticket-editor-loading-value";

const useFormalizeResponseMutation = (
  setActionStatus: (status: ActionStatus) => void,
  setActiveAction: (action: Action) => void,
  setResult: (result: ActionAPIResult) => void,
  setIsPopoverOpen: (state: boolean) => void,
  getCurrentHistory: () => Promise<{
    past: string[];
    present: string;
    future: string[];
  }>,
  updateCurrentHistory: (newHistory: {
    past: string[];
    present: string;
    future: string[];
  }) => void
) => {
  return useMutation({
    mutationFn: async ({
      variant,
      signal,
    }: {
      variant: string;
      signal: AbortSignal;
    }) => {
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 3000);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error(ErrorMessage.ABORTED));
        });
      });
      return { response: `${variant} saved` };
    },
    onMutate: async ({ variant }: { variant: string; signal: AbortSignal }) => {
      setActionStatus(ActionStatus.WORKING);
      setActiveAction(variant as Action);
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
        past: [
          ...(await getCurrentHistory()).past,
          (await getCurrentHistory()).present,
        ],
        present: result.response,
        future: [],
      });
    },
    onError: async (error, variables, context) => {
      if (context && error.message !== ErrorMessage.ABORTED) {
        const { oldComment } = context;
        const givenText = await PancakeAPIs.getComment();
        if (removeHtmlTags(givenText) === TicketEditorLoadingValue.GENERATING) {
          PancakeAPIs.setComment(
            oldComment !== TicketEditorLoadingValue.GENERATING ? oldComment : ""
          );
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

export default useFormalizeResponseMutation;
