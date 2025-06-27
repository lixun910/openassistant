# Type Alias: KeplerGlToolArgs

> **KeplerGlToolArgs**: `z.ZodObject`\<\{ `colorBy`: `z.ZodOptional`\<`z.ZodString`\>; `colorMap`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `color`: `z.ZodString`; `label`: `z.ZodOptional`\<`z.ZodString`\>; `value`: `z.ZodUnion`\<\[`z.ZodString`, `z.ZodNumber`, `z.ZodNull`\]\>; \}\>\>\>; `colorType`: `z.ZodOptional`\<`z.ZodEnum`\<\[`"breaks"`, `"unique"`\]\>\>; `datasetName`: `z.ZodString`; `geometryColumn`: `z.ZodOptional`\<`z.ZodString`\>; `latitudeColumn`: `z.ZodOptional`\<`z.ZodString`\>; `longitudeColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mapType`: `z.ZodEnum`\<\[`"point"`, `"line"`, `"arc"`, `"geojson"`\]\>; \}\>

Defined in: [packages/tools/map/src/keplergl/tool.ts:12](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/map/src/keplergl/tool.ts#L12)
