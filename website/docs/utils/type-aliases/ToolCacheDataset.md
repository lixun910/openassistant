# Type Alias: ToolCacheDataset

> **ToolCacheDataset**: \{ `content`: `GeoJSON.FeatureCollection`; `type`: `"geojson"`; \} \| \{ `content`: `Record`\<`string`, `unknown`\>[]; `type`: `"columnData"`; \} \| \{ `content`: `string`; `type`: `"string"`; \} \| \{ `content`: `unknown`[][]; `type`: `"rowObjects"`; \} \| \{ `content`: `Record`\<`string`, `unknown`\>; `type`: `"json"`; \} \| \{ `content`: \{ `weights`: `number`[][]; `weightsMeta`: `Record`\<`string`, `unknown`\>; \}; `type`: `"weights"`; \} \| \{ `content`: `unknown`; `type`: `"arrow"`; \}

Defined in: [tool-cache.ts:5](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L5)

A dataset in the tool cache.
The type of the content is determined by the tool that added the dataset.
