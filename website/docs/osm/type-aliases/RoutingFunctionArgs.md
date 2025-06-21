# Type Alias: RoutingFunctionArgs

> **RoutingFunctionArgs**: `z.ZodObject`\<\{ `destination`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `mode`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; \}\>

Defined in: [packages/tools/osm/src/routing.ts:44](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/osm/src/routing.ts#L44)
