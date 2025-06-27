# Type Alias: SpatialWeightsFunctionArgs

> **SpatialWeightsFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `distanceThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `includeLowerOrder`: `z.ZodOptional`\<`z.ZodBoolean`\>; `isMile`: `z.ZodOptional`\<`z.ZodBoolean`\>; `k`: `z.ZodOptional`\<`z.ZodNumber`\>; `mapBounds`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodNumber`\>\>; `orderOfContiguity`: `z.ZodOptional`\<`z.ZodNumber`\>; `precisionThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `type`: `z.ZodEnum`\<\[`"knn"`, `"queen"`, `"rook"`, `"threshold"`\]\>; `useCentroids`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:12](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/weights/tool.ts#L12)
