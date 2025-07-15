// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ToolCallComponents, StreamMessagePart } from '@openassistant/core';
import { ToolInvocation } from 'ai';
import React, { ReactNode, memo } from 'react';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import {
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableColumn,
  Card,
  CardBody,
} from '@heroui/react';
import { Icon } from '@iconify/react';

export const MarkdownContent = ({
  text,
  showMarkdown = true,
}: {
  text?: string;
  showMarkdown?: boolean;
}) => {
  if (!showMarkdown) {
    return (
      <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words line-[0.5]">
        {text}
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden whitespace-pre-wrap break-words">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ children }) => (
            <ul className="text-tiny -mt-6 list-disc ml-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-tiny list-decimal ml-8 -mt-5">{children}</ol>
          ),
          li: ({ children }) => (
            // Used Tailwind's CSS nesting syntax to target p tags directly inside li elements with [&>p]
            // Added !mt-0 to force margin-top to 0
            // Used -translate-y-5 to move the paragraph up by 1.25rem to align with the marker
            // Added negative margin bottom to compensate for the translated paragraph
            <li className="text-tiny my-0 h-fit -mb-2 min-h-0 [&>p]:-mb-6 [&>p]:!mt-0 [&>p]:-translate-y-5 [&>p]:h-fit [&>p]:leading-5">
              {children}
            </li>
          ),
          p: ({ children }) => (
            <p className="text-tiny whitespace-pre-wrap m-0 p-0">{children}</p>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
};

class ToolCallErrorBoundary extends React.Component<
  { children: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Tool call component error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-sm text-danger">
          Failed to render tool component.
        </div>
      );
    }

    return this.props.children;
  }
}

const ToolCallComponentRenderer = memo(
  function ToolCallComponentRenderer({
    Component,
    additionalData,
  }: {
    Component:
      | React.ComponentType<Record<string, unknown>>
      | React.ReactElement
      | null;
    additionalData: unknown;
    toolCallId: string;
  }) {
    if (!Component) return null;

    return (
      <ToolCallErrorBoundary>
        {typeof Component === 'function' ? (
          <Component {...(additionalData as Record<string, unknown>)} />
        ) : (
          Component
        )}
      </ToolCallErrorBoundary>
    );
  },
  (prevProps, nextProps) => {
    // comparison of additionalData using toolCallId
    return prevProps.toolCallId === nextProps.toolCallId;
  }
);

export function PartComponent({
  part,
  components,
  useMarkdown,
  showTools,
}: {
  part: StreamMessagePart;
  components?: ToolCallComponents;
  useMarkdown?: boolean;
  showTools?: boolean;
}) {
  if (part.type === 'text') {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-sm">
          {useMarkdown ? <MarkdownContent text={part.text} /> : part.text}
        </div>
      </div>
    );
  } else if (part.type === 'tool-invocation' && showTools) {
    return (
      <>
        <ToolCallComponent
          key={part.toolInvocation.toolCallId}
          toolInvocation={part.toolInvocation}
          additionalData={part.additionalData}
          components={components}
        />
      </>
    );
  } else {
    return <>This part is not supported: {part.type}</>;
  }
}

export function ToolCallComponent({
  toolInvocation,
  additionalData,
  components,
}: {
  toolInvocation: ToolInvocation;
  additionalData: unknown;
  components?: ToolCallComponents;
}) {
  const { toolName, args, state } = toolInvocation;
  const isCompleted = state === 'result';
  const llmResult = state === 'result' ? toolInvocation.result : {};
  const Component = components?.find(
    (component) => component.toolName === toolName
  )?.component as React.ComponentType<Record<string, unknown>> | undefined;

  const toolSuccess = Boolean(llmResult?.success);

  const tableItems = llmResult
    ? Object.entries(llmResult).map(([key, value]) => ({
        key,
        value:
          typeof value === 'object'
            ? JSON.stringify(value, (_, v) =>
                typeof v === 'bigint' ? v.toString() : v
              )
            : String(value),
      }))
    : [];

  return (
    <div className="flex flex-col gap-2">
      <Card radius="none" shadow="none" classNames={{ body: 'p-0 pl-2 pr-2' }}>
        <CardBody className="opacity-50">
          <Accordion
            variant="light"
            isCompact={true}
            className="pt-0 text-tiny"
            itemClasses={{
              title: `text-tiny ${
                !toolSuccess ? 'text-orange-500' : 'text-green-500'
              }`,
              content: 'text-tiny',
            }}
          >
            <AccordionItem
              key="1"
              isCompact={true}
              aria-label={toolName}
              title={`> ${toolName}`}
              startContent={
                !isCompleted && (
                  <Icon icon="svg-spinners:clock" width="12" height="12" />
                )
              }
            >
              <div className="flex flex-col gap-1 p-4">
                <div className="text-tiny font-bold">function call:</div>
                <div className="font-mono text-tiny pl-4">
                  <span>{toolName}</span>
                  <span>(</span>
                  {Object.entries(args).map(([key, value], index, array) => (
                    <span key={key}>
                      <span className="text-blue-600">{key}</span>
                      <span>: </span>
                      <span>
                        {typeof value === 'object' && value !== null
                          ? JSON.stringify(value, (_, v) =>
                              typeof v === 'bigint' ? v.toString() : v
                            )
                          : String(value)}
                      </span>
                      {index < array.length - 1 && (
                        <span className="text-gray-400">, </span>
                      )}
                    </span>
                  ))}
                  <span className="text-gray-400">)</span>
                </div>
              </div>
              {llmResult && (
                <div className="flex flex-col gap-1 p-4">
                  <div className="text-tiny font-bold">result:</div>
                  <Table aria-label="LLM result table" hideHeader isCompact>
                    <TableHeader>
                      <TableColumn>Key</TableColumn>
                      <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody items={tableItems}>
                      {(item) => (
                        <TableRow key={item.key}>
                          <TableCell>{item.key}</TableCell>
                          <TableCell>{item.value}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
      {Component && isCompleted && toolSuccess && (
        <div>
          <ToolCallComponentRenderer
            Component={Component}
            additionalData={additionalData}
            toolCallId={toolInvocation.toolCallId}
          />
        </div>
      )}
    </div>
  );
}
