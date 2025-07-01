# Type Alias: RoutingFunctionArgs

> **RoutingFunctionArgs**: `z.ZodObject`\<\{ `destination`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `mode`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; \}\>

Defined in: [packages/tools/osm/src/routing.ts:44](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/osm/src/routing.ts#L44)
