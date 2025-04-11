# Function: GetAssistantModelByProvider()

> **GetAssistantModelByProvider**(`options`): *typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md) \| *typeof* `AnthropicAssistant`

Defined in: [packages/core/src/lib/model-utils.ts:17](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/lib/model-utils.ts#L17)

Returns the appropriate Assistant model based on the provider.

## Parameters

### options

The options object

#### chatEndpoint?

`string`

The chat endpoint that handles the chat requests, e.g. '/api/chat'. This is required for server-side support.

#### provider?

`string`

The name of the AI provider. If not provided, defaults to OpenAI.

## Returns

*typeof* [`VercelAi`](../classes/VercelAi.md) \| *typeof* [`OpenAIAssistant`](../classes/OpenAIAssistant.md) \| *typeof* [`DeepSeekAssistant`](../classes/DeepSeekAssistant.md) \| *typeof* [`GoogleAIAssistant`](../classes/GoogleAIAssistant.md) \| *typeof* [`XaiAssistant`](../classes/XaiAssistant.md) \| *typeof* [`OllamaAssistant`](../classes/OllamaAssistant.md) \| *typeof* `AnthropicAssistant`

The assistant model class.
