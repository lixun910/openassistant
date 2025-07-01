# Class: ToolOutputManager

Defined in: [tool-output-manager.ts:41](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L41)

ToolOutputManager handles storage and retrieval of tool execution results
Works on both client and server side with mutex protection for concurrent access

## Constructors

### new ToolOutputManager()

> **new ToolOutputManager**(): [`ToolOutputManager`](ToolOutputManager.md)

#### Returns

[`ToolOutputManager`](ToolOutputManager.md)

## Methods

### addToolOutput()

> **addToolOutput**(`toolCallId`, `data`): `Promise`\<`void`\>

Defined in: [tool-output-manager.ts:76](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L76)

Add a tool output to the manager

#### Parameters

##### toolCallId

`string`

Unique identifier for the tool call

##### data

`unknown`

Data returned by the tool

#### Returns

`Promise`\<`void`\>

***

### clearAll()

> **clearAll**(): `Promise`\<`void`\>

Defined in: [tool-output-manager.ts:198](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L198)

Clear all tool outputs

#### Returns

`Promise`\<`void`\>

***

### createOnToolCompletedCallback()

> **createOnToolCompletedCallback**(): (`toolCallId`, `data`?) => `Promise`\<`void`\>

Defined in: [tool-output-manager.ts:224](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L224)

Create an onToolCompleted callback function for use with tools

#### Returns

`Function`

A callback function that can be used with tool configurations

##### Parameters

###### toolCallId

`string`

###### data?

`unknown`

##### Returns

`Promise`\<`void`\>

***

### endSession()

> **endSession**(): `Promise`\<`void`\>

Defined in: [tool-output-manager.ts:62](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L62)

End the current request session

#### Returns

`Promise`\<`void`\>

***

### findDataByDatasetName()

> **findDataByDatasetName**(`datasetName`): `Promise`\<`unknown`\>

Defined in: [tool-output-manager.ts:162](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L162)

Find data by dataset name from all stored tool outputs
Searches through all tool outputs for objects containing the dataset name as a key

#### Parameters

##### datasetName

`string`

Name of the dataset to search for

#### Returns

`Promise`\<`unknown`\>

The data associated with the dataset name, or null if not found

***

### getAllToolOutputs()

> **getAllToolOutputs**(): `Promise`\<`ToolOutput`[]\>

Defined in: [tool-output-manager.ts:186](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L186)

Get all tool outputs (for debugging/admin purposes)

#### Returns

`Promise`\<`ToolOutput`[]\>

Array of all tool outputs

***

### getLastToolOutput()

> **getLastToolOutput**(): `Promise`\<`null` \| `ToolOutput`\>

Defined in: [tool-output-manager.ts:93](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L93)

Get the most recent tool output

#### Returns

`Promise`\<`null` \| `ToolOutput`\>

The last tool output or null if none exists

***

### getLastToolOutputFromCurrentSession()

> **getLastToolOutputFromCurrentSession**(): `Promise`\<`null` \| `ToolOutput`\>

Defined in: [tool-output-manager.ts:108](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L108)

Get the most recent tool output from the current session only

#### Returns

`Promise`\<`null` \| `ToolOutput`\>

The last tool output from current session or null if none exists

***

### getToolOutputsFromCurrentSession()

> **getToolOutputsFromCurrentSession**(): `Promise`\<`ToolOutput`[]\>

Defined in: [tool-output-manager.ts:145](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L145)

Get all tool outputs from the current session

#### Returns

`Promise`\<`ToolOutput`[]\>

Array of tool outputs from current session

***

### hasToolOutputs()

> **hasToolOutputs**(): `Promise`\<`boolean`\>

Defined in: [tool-output-manager.ts:211](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L211)

Check if there are any tool outputs stored

#### Returns

`Promise`\<`boolean`\>

True if there are tool outputs, false otherwise

***

### hasToolOutputsInCurrentSession()

> **hasToolOutputsInCurrentSession**(): `Promise`\<`boolean`\>

Defined in: [tool-output-manager.ts:130](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L130)

Check if there are any tool outputs from the current session

#### Returns

`Promise`\<`boolean`\>

True if there are tool outputs from current session, false otherwise

***

### startSession()

> **startSession**(): `Promise`\<`string`\>

Defined in: [tool-output-manager.ts:49](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-output-manager.ts#L49)

Start a new request session to track tool outputs for this specific request

#### Returns

`Promise`\<`string`\>
