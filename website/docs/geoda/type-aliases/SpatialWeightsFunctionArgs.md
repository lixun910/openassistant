# Type Alias: SpatialWeightsFunctionArgs

> **SpatialWeightsFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `distanceThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `includeLowerOrder`: `z.ZodOptional`\<`z.ZodBoolean`\>; `isMile`: `z.ZodOptional`\<`z.ZodBoolean`\>; `k`: `z.ZodOptional`\<`z.ZodNumber`\>; `mapBounds`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodNumber`\>\>; `orderOfContiguity`: `z.ZodOptional`\<`z.ZodNumber`\>; `precisionThreshold`: `z.ZodOptional`\<`z.ZodNumber`\>; `type`: `z.ZodEnum`\<\[`"knn"`, `"queen"`, `"rook"`, `"threshold"`\]\>; `useCentroids`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:12](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/geoda/src/weights/tool.ts#L12)
