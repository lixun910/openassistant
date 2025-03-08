import { Icon } from '@iconify/react';
import { Button, Tooltip } from '@nextui-org/react';
import { StreamMessage } from '@openassistant/core';

export const MessageActions = ({
  isMessageDraggable,
  index,
  message,
  handleCopy,
  handleFeedback,
  copied,
  feedback,
}: {
  isMessageDraggable: boolean;
  index: number;
  message?: StreamMessage;
  handleCopy: () => void;
  handleFeedback: (index: number, liked: boolean) => void;
  copied: boolean;
  feedback?: 'like' | 'dislike';
}) => {
  const onMessageDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    index: number,
    message?: StreamMessage
  ) => {
    // when message is string
    if (message?.text) {
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          id: `message-${index}`,
          type: 'text',
          data: message.text,
        })
      );
    }
  };

  return (
    <div className="">
      <Tooltip content="Drag to move">
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          data-testid="drag-button"
          draggable={isMessageDraggable}
          onDragStart={(e) => onMessageDragStart(e, index, message)}
        >
          <Icon
            className="text-gray-600 dark:text-gray-400"
            icon="basil:move-outline"
          />
        </Button>
      </Tooltip>
      <Tooltip content="Copy Text">
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          onPress={handleCopy}
          data-testid="copytext-button"
        >
          {copied ? (
            <Icon
              className="text-gray-600 dark:text-gray-400"
              icon="gravity-ui:check"
            />
          ) : (
            <Icon
              className="text-gray-600 dark:text-gray-400"
              icon="gravity-ui:copy"
            />
          )}
        </Button>
      </Tooltip>
      <Tooltip content="Feedback">
        <Button
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          onPress={() => handleFeedback(index, false)}
          data-testid="feedback-button"
        >
          {feedback === 'dislike' ? (
            <Icon
              className="text-gray-600 dark:text-gray-400"
              icon="gravity-ui:thumbs-down-fill"
            />
          ) : (
            <Icon
              className="text-gray-600 dark:text-gray-400"
              icon="gravity-ui:thumbs-down"
            />
          )}
        </Button>
      </Tooltip>
    </div>
  );
};
