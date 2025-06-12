# Type Alias: IsochroneFunctionArgs

> **IsochroneFunctionArgs**: `z.ZodObject`\<\{ `distanceLimit`: `z.ZodOptional`\<`z.ZodNumber`\>; `origin`: `z.ZodObject`\<\{ `latitude`: `z.ZodNumber`; `longitude`: `z.ZodNumber`; \}\>; `polygons`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodBoolean`\>\>; `profile`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodEnum`\<\[`"driving"`, `"walking"`, `"cycling"`\]\>\>\>; `timeLimit`: `z.ZodOptional`\<`z.ZodDefault`\<`z.ZodNumber`\>\>; \}\>

Defined in: [packages/tools/osm/src/isochrone.ts:28](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/osm/src/isochrone.ts#L28)
