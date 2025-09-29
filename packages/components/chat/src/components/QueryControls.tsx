import { Button, cn, Textarea } from '@sqlrooms/ui';
import { ArrowUpIcon, OctagonXIcon } from 'lucide-react';
import {
  PropsWithChildren,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useChatStore } from '../store';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import type { UIMessage } from 'ai';

type QueryControlsProps = PropsWithChildren<{
  className?: string;
  placeholder?: string;
  onRun?: () => void;
  onCancel?: () => void;
}>;

export const QueryControls: React.FC<QueryControlsProps> = ({
  className,
  placeholder = 'What would you like to learn about the data?',
  children,
  onRun,
  onCancel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRunningAnalysis = useChatStore((s) => s.ai.isRunningAnalysis);
  const startAnalysis = useChatStore((s) => s.ai.startAnalysis);
  const cancelAnalysis = useChatStore((s) => s.ai.cancelAnalysis);
  const analysisPrompt = useChatStore((s) => s.ai.analysisPrompt);
  // const isDataAvailable = useChatStore((s) => s.room.isDataAvailable);
  const setAnalysisPrompt = useChatStore((s) => s.ai.setAnalysisPrompt);
  const currentSession = useChatStore((s) => s.ai.getCurrentSession());
  const model = currentSession?.model;
  const sessionId = currentSession?.id;

  const getLocalChatTransport = useChatStore((s) => s.ai.getLocalChatTransport);
  const getRemoteChatTransport = useChatStore(
    (s) => s.ai.getRemoteChatTransport
  );
  const endPoint = useChatStore((s) => s.ai.endPoint);
  const headers = useChatStore((s) => s.ai.headers);
  const onChatToolCall = useChatStore((s) => s.ai.onChatToolCall);
  const onChatFinish = useChatStore((s) => s.ai.onChatFinish);
  const onChatError = useChatStore((s) => s.ai.onChatError);
  const setSessionUiMessages = useChatStore((s) => s.ai.setSessionUiMessages);

  const transport: DefaultChatTransport<UIMessage> = useMemo(() => {
    // Recreate transport when the model changes
    void model;
    const trimmed = (endPoint || '').trim();
    if (trimmed.length > 0) {
      return getRemoteChatTransport(trimmed, headers);
    }
    return getLocalChatTransport();
  }, [getLocalChatTransport, getRemoteChatTransport, headers, endPoint, model]);

  const { messages, sendMessage } = useChat({
    id: sessionId,
    transport,
    messages: (currentSession?.uiMessages as unknown as UIMessage[]) ?? [],
    onToolCall: onChatToolCall,
    onFinish: onChatFinish,
    onError: onChatError,
    // Automatically submit when all tool results are available
    // NOTE: When using sendAutomaticallyWhen, don't use await with addToolResult inside onChatToolCall as it can cause deadlocks.
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });
  // Sync streaming updates into the store so UiMessages renders incrementally
  useEffect(() => {
    if (!sessionId) return;
    setSessionUiMessages(sessionId, messages as UIMessage[]);
  }, [messages, sessionId, setSessionUiMessages]);

  useEffect(() => {
    // if (!isDataAvailable) return;
    // Focus the textarea when the component mounts
    // Using a small timeout ensures the data is loaded and
    // add timeout to prevent aria hidden warning caused by the
    // loading progress dialog being still open
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        e.key === 'Enter' &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey
      ) {
        e.preventDefault();
        if (!isRunningAnalysis && model && analysisPrompt.trim().length) {
          startAnalysis(sendMessage);
        }
      }
    },
    [isRunningAnalysis, model, analysisPrompt, startAnalysis, sendMessage]
  );

  const canStart = Boolean(model && analysisPrompt.trim().length);

  const handleClickRunOrCancel = useCallback(() => {
    if (isRunningAnalysis) {
      cancelAnalysis();
      onCancel?.();
    } else {
      startAnalysis(sendMessage);
      onRun?.();
    }
  }, [
    isRunningAnalysis,
    cancelAnalysis,
    onCancel,
    sendMessage,
    onRun,
    startAnalysis,
  ]);

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4',
        className
      )}
    >
      <div className="bg-muted/50 flex h-full w-full flex-row items-center gap-2 rounded-md border">
        <div className="flex w-full flex-col gap-1 overflow-hidden">
          <Textarea
            ref={textareaRef}
            disabled={isRunningAnalysis}
            className="min-h-[30px] resize-none border-none p-2 text-sm outline-none focus-visible:ring-0"
            autoResize
            value={analysisPrompt}
            onChange={(e) => setAnalysisPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
          />
          <div className="align-stretch flex w-full items-center gap-2 overflow-hidden">
            <div className="flex h-full w-full min-w-0 items-center gap-2 overflow-hidden">
              <div className="min-w-0 flex-1 overflow-hidden pl-2">
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-1">
                  {children}
                </div>
              </div>
              <div className="ml-auto shrink-0 pr-2">
                <Button
                  className="h-8 w-8 rounded-full"
                  variant="default"
                  size="icon"
                  onClick={handleClickRunOrCancel}
                  disabled={!canStart}
                >
                  {isRunningAnalysis ? <OctagonXIcon /> : <ArrowUpIcon />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
