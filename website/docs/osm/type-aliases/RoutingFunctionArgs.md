# Type Alias: RoutingFunctionArgs

> **RoutingFunctionArgs**: `z.ZodObject`\<\{ `destination`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `mode`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; \}\>

Defined in: [packages/tools/osm/src/routing.ts:44](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/osm/src/routing.ts#L44)
