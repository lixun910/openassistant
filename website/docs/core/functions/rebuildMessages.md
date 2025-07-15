# Function: rebuildMessages()

> **rebuildMessages**(`conversations`): `Message`[]

Defined in: [packages/core/src/utils/messages.ts:40](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/core/src/utils/messages.ts#L40)

Rebuild the messages from the conversations, which is an array of `{prompt, response}`.
The messages are in the format of the Message interface in Vercel AI SDK.
This function can be used to restore the messages from the persisted conversations.

For example:
```ts
const messages = rebuildMessages([
  {
    prompt: 'What is the capital of France?',
    response: { text: 'Paris' },
  },
]);

// create assistant
const assistant = createAssistant({
  model: 'gpt-4o',
});

assistant.setMessages(messages);
```

## Parameters

### conversations

[`Conversation`](../type-aliases/Conversation.md)[]

The conversations to rebuild the messages from

## Returns

`Message`[]

The messages used in the Vercel AI SDK
