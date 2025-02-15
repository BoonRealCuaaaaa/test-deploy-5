import { useEffect, useRef, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

import { useI18n } from '@/shared/hooks/use-i18n';
import ActionProcessing from '@/shared/modules/response-toolbox/components/action-processing';
import Header from '@/shared/modules/response-toolbox/components/header';
import Menu from '@/shared/modules/response-toolbox/components/menu';
import { Action } from '@/shared/modules/response-toolbox/constants/action';
import { ActionStatus } from '@/shared/modules/response-toolbox/constants/action-status';
import { ActionAPIResult } from '@/shared/modules/response-toolbox/types/action-api-result';
import { AllActionCommands } from '@/shared/modules/response-toolbox/types/action-command';
import { ResponseToolboxTranslation } from '@/shared/modules/response-toolbox/types/translation';
import { PancakeAPIs } from '@/src/app/apis/pancake-apis';
import { removeHtmlTags } from '@/src/app/lib/utils/remove-html-tags';
import useAppStore from '@/src/app/stores';

import { ErrorMessage } from '../../constants/error-message';
import { TICKET_EDITOR_DEFAULT_SIZE } from '../../constants/size';
import {
  isValueInTicketEditorLoadingValue,
  TicketEditorLoadingValue,
} from '../../constants/ticket-editor-loading-value';
import { getHistoryForTicket, updateHistoryForTicket } from '../../helpers/response-history';
import useDraftResponseMutation from '../../hooks/use-draft-response-mutation';
import useFormalizeResponseMutation from '../../hooks/use-formalize-response-mutation';
import Onboarding from '../onboarding';
import TicketEditorSvg from '../ticket-editor-svg';

const TicketEditorPopover = () => {
  const { t } = useI18n();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus>(ActionStatus.NONE);
  const abortController = useRef<AbortController | null>(null);
  const [activeAction, setActiveAction] = useState<Action>();
  const [result, setResult] = useState<ActionAPIResult>();
  const [ticketHistories, setTicketHistories] = useState<
    Record<string, { past: string[]; present: string; future: string[] }>
  >({});
  const [history, setHistory] = useState({
    past: [] as string[],
    present: '',
    future: [] as string[],
  });
  const [isReDraft, setIsReDraft] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const h = await getHistoryForTicket(ticketHistories);
      setHistory(h);
    };
    fetchHistory();
  }, [ticketHistories]);

  const updateCurrentHistory = (newHistory: { past: string[]; present: string; future: string[] }) => {
    updateHistoryForTicket(ticketHistories, setTicketHistories, newHistory);
    setHistory(newHistory);
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const translation: ResponseToolboxTranslation = {
    responseToolbox: t('ticket_editor.response_toolbox'),
    formalization: t('ticket_editor.formalization'),
    onWorkingMsg: t('ticket_editor.on_working_msg'),
    actions: {
      [Action.DRAFT_RESPONSE]: {
        title: t('ticket_editor.actions.draft_response.title'),
        reDraftTitle: t('ticket_editor.actions.draft_response.re_draft_title'),
        onWorking: t('ticket_editor.actions.draft_response.on_working'),
        onSuccess: t('ticket_editor.actions.draft_response.on_success'),
        onFailed: t('ticket_editor.actions.draft_response.on_failed'),
      },
      [Action.CORRECT_SPELLING]: {
        title: t('ticket_editor.actions.correct_spelling.title'),
        onWorking: t('ticket_editor.actions.correct_spelling.on_working'),
        onSuccess: t('ticket_editor.actions.correct_spelling.on_success'),
        onFailed: t('ticket_editor.actions.correct_spelling.on_failed'),
      },
      [Action.SIMPLIFY_WORDS]: {
        title: t('ticket_editor.actions.simplify_words.title'),
        onWorking: t('ticket_editor.actions.simplify_words.on_working'),
        onSuccess: t('ticket_editor.actions.simplify_words.on_success'),
        onFailed: t('ticket_editor.actions.simplify_words.on_failed'),
      },
      [Action.SHORTEN_RESPONSE]: {
        title: t('ticket_editor.actions.shorten_response.title'),
        onWorking: t('ticket_editor.actions.shorten_response.on_working'),
        onSuccess: t('ticket_editor.actions.shorten_response.on_success'),
        onFailed: t('ticket_editor.actions.shorten_response.on_failed'),
      },
      [Action.LENGTHEN_RESPONSE]: {
        title: t('ticket_editor.actions.lengthen_response.title'),
        onWorking: t('ticket_editor.actions.lengthen_response.on_working'),
        onSuccess: t('ticket_editor.actions.lengthen_response.on_success'),
        onFailed: t('ticket_editor.actions.lengthen_response.on_failed'),
      },
    },
  };

  const generateDraftResponse = async () => {
    const currentComment = await PancakeAPIs.getComment();

    if (currentComment !== '' && !isValueInTicketEditorLoadingValue(currentComment)) {
      ACTION_COMMANDS[Action.DRAFT_RESPONSE].onActive();
    }
  };

  const [conversationNode, setConversationNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const updateTargetNode = () => {
      const newTarget = document.querySelector('.message-list.media-list.media-list-conversation') as HTMLElement;

      setConversationNode(newTarget);
    };

    const observer = new MutationObserver(updateTargetNode);
    observer.observe(document.body, { childList: true, subtree: true });

    updateTargetNode();

    return () => observer.disconnect();
  }, [conversationNode]);

  // Auto draft when new message
  useEffect(() => {
    const autoDraft = (mutationList: MutationRecord[]) => {
      mutationList.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.classList.contains('media-current-customer')) {
              generateDraftResponse();
            }
          });
        }
      });
    };

    const observer = new MutationObserver(autoDraft);
    const config = { childList: true, attributes: true, subtree: false };
    if (conversationNode) {
      observer.observe(conversationNode, config);
    }
  }, [conversationNode]);

  // Auto draft when open ticket
  useEffect(() => {
    if (conversationNode) {
      const lastMessage = conversationNode.children[conversationNode.children.length - 2];

      if (lastMessage && lastMessage.classList.contains('media-current-customer')) {
        generateDraftResponse();
      }
    }
  }, [conversationNode]);

  // Auto draft when change ticket
  useEffect(() => {
    const targetNode = document.querySelector('.virtual-scroll-area');

    if (targetNode) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (
              node instanceof HTMLElement &&
              node.matches('.message-list.media-list.media-list-conversation.c-w-md.virtual-scroll')
            ) {
              const lastMessage = node.children[node.children.length - 2];

              if (lastMessage && lastMessage.classList.contains('media-current-customer')) {
                generateDraftResponse();
              }
            }
          });
        });
      });

      observer.observe(targetNode, { childList: true, subtree: false });
    }
  }, []);

  const { mutate: mutateDraftResponse } = useDraftResponseMutation(
    setActionStatus,
    setActiveAction,
    setResult,
    setIsReDraft,
    setIsPopoverOpen,
    async () => history,
    updateCurrentHistory
  );

  const { mutate: mutateFormalizeResponse } = useFormalizeResponseMutation(
    setActionStatus,
    setActiveAction,
    setResult,
    setIsPopoverOpen,
    async () => history,
    updateCurrentHistory
  );

  const ACTION_COMMANDS: AllActionCommands = {
    [Action.DRAFT_RESPONSE]: {
      onActive: async () => {
        if (abortController.current) {
          abortController.current.abort(ErrorMessage.ABORTED);
        }
        abortController.current = new AbortController();
        return mutateDraftResponse(abortController.current.signal);
      },
    },
    [Action.CORRECT_SPELLING]: {
      onActive: () => {
        if (abortController.current) {
          abortController.current.abort(ErrorMessage.ABORTED);
        }
        abortController.current = new AbortController();
        return mutateFormalizeResponse({
          variant: Action.CORRECT_SPELLING,
          signal: abortController.current.signal,
        });
      },
    },
    [Action.SIMPLIFY_WORDS]: {
      onActive: () => {
        if (abortController.current) {
          abortController.current.abort(ErrorMessage.ABORTED);
        }
        abortController.current = new AbortController();
        return mutateFormalizeResponse({
          variant: Action.SIMPLIFY_WORDS,
          signal: abortController.current.signal,
        });
      },
    },
    [Action.SHORTEN_RESPONSE]: {
      onActive: () => {
        if (abortController.current) {
          abortController.current.abort(ErrorMessage.ABORTED);
        }
        abortController.current = new AbortController();
        return mutateFormalizeResponse({
          variant: Action.SHORTEN_RESPONSE,
          signal: abortController.current.signal,
        });
      },
    },
    [Action.LENGTHEN_RESPONSE]: {
      onActive: () => {
        if (abortController.current) {
          abortController.current.abort(ErrorMessage.ABORTED);
        }
        abortController.current = new AbortController();
        return mutateFormalizeResponse({
          variant: Action.LENGTHEN_RESPONSE,
          signal: abortController.current.signal,
        });
      },
    },
  };

  const onActionClick = (action: Action) => {
    ACTION_COMMANDS[action].onActive();
  };

  const onAbortClick = async () => {
    if (abortController.current) {
      abortController.current.abort(ErrorMessage.ABORTED);
      setActionStatus(ActionStatus.FAILED);
      setResult({ errorMsg: t('ticket_editor.cancel_action') });
      setTimeout(() => {
        setActionStatus(ActionStatus.NONE);
        setIsPopoverOpen(false);
      }, 1000);
      const givenText = await PancakeAPIs.getComment();
      if (removeHtmlTags(givenText) === TicketEditorLoadingValue.GENERATING) {
        if (canUndo) {
          PancakeAPIs.setComment(history.present);
        } else {
          PancakeAPIs.setComment('');
        }
      }
    }
  };

  const onUndoResponse = async () => {
    const { past, present, future } = history;
    if (past.length) {
      const newPresent = past[past.length - 1] ?? '';
      const newPast = past.slice(0, past.length - 1);
      const newFuture = [present, ...future];
      updateCurrentHistory({
        past: newPast,
        present: newPresent,
        future: newFuture,
      });
      PancakeAPIs.setComment(newPresent);
    }
  };

  const onRedoResponse = async () => {
    const { past, present, future } = history;
    if (future.length) {
      const newPresent = future[0] ?? '';
      const newFuture = future.slice(1);
      const newPast = [...past, present];
      updateCurrentHistory({
        past: newPast,
        present: newPresent,
        future: newFuture,
      });
      PancakeAPIs.setComment(newPresent);
    }
  };

  const { isLogin, isRegisteredDomain } = useAppStore((state) => state);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Popover.Trigger
          className="flex items-center rounded border-0 bg-transparent px-4 py-2 font-bold text-white"
          onClick={() => setIsPopoverOpen(true)}
        >
          <TicketEditorSvg />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-fit rounded-lg border border-gray-300 bg-white shadow-lg"
            side="top"
            sideOffset={5}
          >
            {!isLogin || !isRegisteredDomain ? (
              <Onboarding />
            ) : (
              <div className="mx-3 flex flex-col gap-3 py-2.5">
                <Header
                  showCommand={actionStatus === ActionStatus.NONE}
                  onUndo={onUndoResponse}
                  onRedo={onRedoResponse}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  translation={translation}
                />
                {actionStatus === ActionStatus.NONE ? (
                  <div
                    style={{
                      width: `${TICKET_EDITOR_DEFAULT_SIZE.MENU.width}px`,
                    }}
                  >
                    <Menu onClick={onActionClick} translation={translation} isReDraft={isReDraft} />
                  </div>
                ) : (
                  <div
                    style={{
                      width: `${TICKET_EDITOR_DEFAULT_SIZE.ACTION_STATUS.width}px`,
                    }}
                  >
                    <ActionProcessing
                      status={actionStatus}
                      activeAction={activeAction}
                      result={result}
                      translation={translation}
                      onAbortClick={onAbortClick}
                    />
                  </div>
                )}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default TicketEditorPopover;
