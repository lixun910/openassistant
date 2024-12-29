import React, { ReactNode, useEffect, useState } from 'react';
import {
  MessageModel,
  useAssistant,
  UseAssistantProps,
} from '@openassistant/core';
import MessageCard from './message-card';
import PromptInputWithBottomActions from './prompt-input-with-bottom-actions';
import { ChatContainer } from './chat-container';
import {
  sendImageMessageHandler,
  sendTextMessageHandler,
} from './assistant-utils';

/**
 * Type of AiAssistantProps.
 *
 * @param theme - The theme of the assistant.
 * @param welcomeMessage - The welcome message of the assistant.
 * @param historyMessages - The history messages of the assistant.
 * @param ideas - The ideas of the assistant.
 * @param userAvatar - The avatar of the user.
 * @param assistantAvatar - The avatar of the assistant.
 * @param isMessageDraggable - The flag to indicate if the message is draggable.
 * @param enableVoice - The flag to indicate if the voice is enabled.
 * @param enableScreenCapture - The flag to indicate if the screen capture is enabled.
 * @param screenCapturedBase64 - The screen captured base64.
 * @param screenCapturedPrompt - The screen captured prompt.
 * @param onScreenshotClick - The callback function to handle the screenshot click.
 * @param onRemoveScreenshot - The callback function to handle the screenshot remove.
 * @param onFeedback - The callback function to handle the feedback.
 * @param onMessagesUpdated - The callback function to handle the messages updated.
 * @param onRestartChat - The callback function to handle the restart chat.
 * @param fontSize - The font size of the assistant.
 */
export type AiAssistantProps = UseAssistantProps & {
  theme?: 'dark' | 'light';
  welcomeMessage: string;
  historyMessages?: MessageModel[];
  ideas?: { title: string; description: string }[];
  userAvatar?: ReactNode | string;
  assistantAvatar?: ReactNode | string;
  isMessageDraggable?: boolean;
  enableVoice?: boolean;
  enableScreenCapture?: boolean;
  screenCapturedBase64?: string;
  screenCapturedPrompt?: string;
  onScreenshotClick?: () => void;
  onRemoveScreenshot?: () => void;
  onFeedback?: (question: string) => void;
  onMessagesUpdated?: (messages: MessageModel[]) => void;
  onRestartChat?: () => void;
  fontSize?: string;
  botMessageClassName?: string;
  userMessageClassName?: string;
  githubIssueLink?: string;
};

/**
 * Creates a welcome message.
 * @param welcomeMessage - The welcome message.
 * @returns The welcome message.
 */
const createWelcomeMessage = (welcomeMessage: string): MessageModel => ({
  message: welcomeMessage,
  sentTime: 'just now',
  sender: 'assistant',
  direction: 'incoming',
  position: 'first',
});

/**
 * Main AI Assistant component for React applications
 * @component
 * @param {AiAssistantProps} props - The props of the Assistant component. See {@link AiAssistantProps} for more details.
 * @returns {JSX.Element} The rendered AI Assistant component
 * @example
 * ```tsx
 * <AiAssistant
 *   modelProvider="openai"
 *   model="gpt-4"
 *   apiKey="your-api-key"
 * />
 * ```
 */
export function AiAssistant(props: AiAssistantProps) {
  const [messages, setMessages] = useState<MessageModel[]>(
    props.historyMessages && props.historyMessages.length > 0
      ? props.historyMessages
      : [createWelcomeMessage(props.welcomeMessage)]
  );
  const [isPrompting, setIsPrompting] = useState(false);

  const {
    stopChat,
    restartChat,
    sendTextMessage,
    sendImageMessage,
    audioToText,
  } = useAssistant({
    modelProvider: props.modelProvider,
    model: props.model,
    apiKey: props.apiKey,
    instructions: props.instructions,
    functions: props.functions,
    name: props.name,
    description: props.description,
    version: props.version,
    baseUrl: props.baseUrl,
  });

  const isScreenshotAvailable =
    props.screenCapturedBase64?.startsWith('data:image');

  /**
   * Handles sending a message, either as text or image based on the presence of a screenshot.
   * @param {string} message - The message to be sent.
   */
  const onSendMessage = async (message: string) => {
    const messageHandlerProps = {
      newMessage: message,
      messages,
      setMessages,
      setTypingIndicator: setIsPrompting,
      onMessagesUpdated: props.onMessagesUpdated,
    };

    if (isScreenshotAvailable) {
      // Handle image message
      await sendImageMessageHandler({
        ...messageHandlerProps,
        imageBase64String: props.screenCapturedBase64!,
        sendImageMessage,
      });
      // delete the screenshot
      props.onRemoveScreenshot?.();
    } else {
      // Handle text message
      await sendTextMessageHandler({
        ...messageHandlerProps,
        sendTextMessage,
      });
    }
  };

  /**
   * Handles voice messages by converting audio to text.
   * @param {Blob} audioBlob - The audio blob to be converted to text.
   * @returns {Promise<string>} The transcribed text from the audio, or an empty string if transcription fails.
   */
  const onVoiceMessage = async (audioBlob: Blob) => {
    return (await audioToText(audioBlob)) || '';
  };

  /**
   * Stops the currently running chat and updates the message list.
   * This function is called when the user wants to interrupt the ongoing conversation.
   */
  const onStopChat = () => {
    // Set the prompting state to false to indicate that the chat has stopped
    setIsPrompting(false);

    // stop processing
    stopChat();
  };

  const reportQuestion = (messageIndex: number) => {
    // report the message
    const question = messages[messageIndex].message;
    if (props.onFeedback) {
      props.onFeedback(question || '');
    }
  };

  /**
   * Restart the current chat
   */
  const onRestartChat = async () => {
    // set the prompting state to false
    setIsPrompting(false);

    // reset the messages
    setMessages([createWelcomeMessage(props.welcomeMessage)]);

    // restart the assistant
    await restartChat();

    // call the onRestartChat callback
    props.onRestartChat?.();
  };

  // scroll to bottom when new message is added
  useEffect(() => {
    // hack to scroll to bottom
    const element = document.getElementById('chat-message-list');
    if (element?.firstElementChild) {
      element.scrollTop = element.firstElementChild.scrollHeight + 100;
    }
  }, [messages]);

  const getAvatar = (direction: string | number) => {
    return direction === 'incoming'
      ? props.assistantAvatar || <AvatarIcon />
      : props.userAvatar;
  };

  const onMessageDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
    message: string
  ) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: `message-${index}`,
        type: 'text',
        message,
      })
    );
  };

  return (
    <ChatContainer theme={props.theme || 'light'}>
      <div
        className={`order-1 m-2 flex h-full flex-grow flex-col overflow-y-auto overflow-x-hidden ${
          props.fontSize ?? 'text-small'
        }`}
      >
        <div
          className="relative flex h-full flex-col gap-4 overflow-y-auto overflow-x-hidden px-1"
          id="chat-message-list"
        >
          <div className="overscroll-behavior-y-auto overflow-anchor-auto touch-action-none absolute bottom-0 left-0 right-0 top-0 flex h-full flex-col gap-4 px-1">
            {messages.map((message, i) => {
              const messageElement = message.message as string;
              return (
                <MessageCard
                  key={i}
                  index={i}
                  data-testid="message-card"
                  avatar={getAvatar(message.direction)}
                  currentAttempt={i === 1 ? 2 : 1}
                  message={messageElement}
                  customMessage={message.payload}
                  messageClassName={
                    message.direction === 'outgoing'
                      ? props.userMessageClassName ||
                        'bg-content3 text-content3-foreground'
                      : props.botMessageClassName || 'bg-content2'
                  }
                  showFeedback={message.direction === 'incoming'}
                  status={
                    isPrompting && i === messages.length - 1
                      ? 'pending'
                      : message.sender === 'Error'
                        ? 'failed'
                        : 'success'
                  }
                  onFeedback={reportQuestion}
                  draggable={props.isMessageDraggable || false}
                  unselectable="on"
                  onDragStart={(e) => onMessageDragStart(e, i, messageElement)}
                  githubIssueLink={props.githubIssueLink}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <PromptInputWithBottomActions
            ideas={props.ideas}
            onSendMessage={onSendMessage}
            onVoiceMessage={onVoiceMessage}
            enableVoice={props.enableVoice}
            enableScreenCapture={props.enableScreenCapture}
            onScreenshotClick={props.onScreenshotClick}
            onRemoveScreenshot={props.onRemoveScreenshot}
            screenCaptured={props.screenCapturedBase64}
            defaultPromptText={props.screenCapturedPrompt}
            status={isPrompting ? 'pending' : 'success'}
            onStopChat={onStopChat}
            onRestartChat={onRestartChat}
            fontSize={props.fontSize}
          />
          <p
            className={`px-2 ${
              props.fontSize ?? 'text-tiny'
            } text-gray-400 dark:text-gray-600`}
          >
            AI can make mistakes. Consider checking information.
          </p>
        </div>
      </div>
    </ChatContainer>
  );
}

type AvatarIconProps = {
  width?: number;
  height?: number;
  className?: string;
};

export function AvatarIcon({
  width = 16,
  height = 16,
  className = '',
}: AvatarIconProps) {
  return (
    <svg
      aria-hidden="true"
      role="img"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15.5 10.071c0-2.582-1.426-4.853-3.633-6.087l1.039-1.87a.75.75 0 1 0-1.312-.728l-1.11 1.997A8.1 8.1 0 0 0 8 3a8.1 8.1 0 0 0-2.485.383l-1.11-1.997a.75.75 0 1 0-1.31.728l1.038 1.87C1.926 5.218.5 7.489.5 10.07c0 .813.169 1.603.614 2.294c.448.697 1.09 1.158 1.795 1.46C4.227 14.39 6.02 14.5 8 14.5s3.773-.11 5.09-.675c.707-.302 1.348-.763 1.796-1.46c.446-.691.614-1.481.614-2.294m-13.5 0C2 12.5 4 13 8 13s6-.5 6-2.929c0-3-2.5-5.571-6-5.571s-6 2.57-6 5.57m8.5 1.179a.75.75 0 0 1-.75-.75V9a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75m-5.75-.75a.75.75 0 0 0 1.5 0V9a.75.75 0 0 0-1.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
