# Type Alias: IsochroneFunctionArgs

> **IsochroneFunctionArgs**: `z.ZodObject`\<\{ `distanceLimit`: `z.ZodOptional`\<`z.ZodNumber`\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `polygons`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodBoolean`\>\>; `profile`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>\>; `timeLimit`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodNumber`\>\>; \}\>

Defined in: [packages/tools/osm/src/isochrone.ts:28](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/osm/src/isochrone.ts#L28)
