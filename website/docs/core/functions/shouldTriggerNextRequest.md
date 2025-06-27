# Function: shouldTriggerNextRequest()

> **shouldTriggerNextRequest**(`messages`, `messageCount`, `maxSteps`, `currentStep`): `boolean`

Defined in: [packages/core/src/llm/vercelai.ts:60](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/core/src/llm/vercelai.ts#L60)

Checks if another request should be triggered based on the current message state

## Parameters

### messages

`CoreMessage`[]

Current message array

### messageCount

`number`

Previous message count before last request

### maxSteps

`number`

Maximum number of allowed steps

### currentStep

`number`

Current maximum tool invocation step

## Returns

`boolean`

boolean indicating if another request should be triggered
