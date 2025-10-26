# Abort Signal Implementation for Tool Execution

## Summary

This implementation adds comprehensive abort signal support throughout the OpenAssistant tool execution system, allowing users to cancel tool execution from the UI (e.g., via the "cancel conversation" button in the chat interface).

## Changes Made

### 1. Infrastructure (Already in Place)

The abort signal infrastructure was already present in the codebase:

- **`OpenAssistantToolExecutionOptions`** in `/workspace/packages/utils/src/tool.ts` already includes `abortSignal?: AbortSignal`
- **`executeToolCall`** in `/workspace/packages/core/src/utils/toolcall.ts` already passes the abort signal to tool execute functions
- **`VercelAi`** in `/workspace/packages/core/src/llm/vercelai.ts` already passes `this.abortController?.signal` when executing tools

### 2. Updated Tools to Listen to Abort Signal

Updated all tool implementations to properly respect the abort signal from options:

#### A. Tools with Timeout Controllers (Combined with External Abort)

These tools already had internal abort controllers for timeouts. Updated them to ALSO listen to the external abort signal:

**Places Tools:**
- `/workspace/packages/tools/places/src/webSearch.ts` - Web search tool
- `/workspace/packages/tools/places/src/placeSearch.ts` - Foursquare place search
- `/workspace/packages/tools/places/src/geoTagging.ts` - Foursquare geotagging

**OSM Tools:**
- `/workspace/packages/tools/osm/src/routing.ts` - Mapbox routing
- `/workspace/packages/tools/osm/src/isochrone.ts` - Mapbox isochrone

**Pattern used:**
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);

// Listen to external abort signal if provided
if (options?.abortSignal) {
  options.abortSignal.addEventListener('abort', () => controller.abort());
}

try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeoutId);
}
```

#### B. Tools Using Fetch Without Abort Controllers

Updated these tools to add the abort signal parameter to their fetch calls and add `options` parameter to their execute function:

**OSM Tools:**
- `/workspace/packages/tools/osm/src/geocoding.ts` - Nominatim geocoding
- `/workspace/packages/tools/osm/src/reverseGeocoding.ts` - Nominatim reverse geocoding
- `/workspace/packages/tools/osm/src/roads.ts` - Overpass API roads query
- `/workspace/packages/tools/osm/src/us/state.ts` - US state boundaries
- `/workspace/packages/tools/osm/src/us/zipcode.ts` - US zipcode boundaries
- `/workspace/packages/tools/osm/src/us/city.ts` - US city boundaries
- `/workspace/packages/tools/osm/src/us/county.ts` - US county boundaries
- `/workspace/packages/tools/osm/src/us/queryZipcode.ts` - Query zipcodes in bounds

**Map Tools:**
- `/workspace/packages/tools/map/src/data/tool.ts` - Download map data from URL

**Pattern used:**
```typescript
execute: async (args, options) => {
  try {
    const response = await fetch(url, { 
      signal: options?.abortSignal 
    });
    // ...
  }
}
```

#### C. Tools with Long-Running Operations

Added abort signal checks at strategic points in tools with loops or expensive operations:

**DuckDB Tools:**
- `/workspace/packages/tools/duckdb/src/query-tool.ts` - SQL query execution
  - Check before starting
  - Check in variable loading loop
  - Check before query execution
  
- `/workspace/packages/tools/duckdb/src/merge-tool.ts` - Table merge operations
  - Check before starting
  - Check in both data loading loops
  - Check before merge query execution

**OSM Tools:**
- `/workspace/packages/tools/osm/src/roads.ts` - Added check in chunk processing loop
- `/workspace/packages/tools/osm/src/geocoding.ts` - Added check in retry loop
- `/workspace/packages/tools/osm/src/reverseGeocoding.ts` - Added check in retry loop

**Geoda Tools:**
- `/workspace/packages/tools/geoda/src/spatial_ops/centroid.ts` - Added check at start

**Pattern used:**
```typescript
// Check before expensive operations
if (options?.abortSignal?.aborted) {
  throw new Error('Operation was aborted');
}

// Check in loops
for (const item of items) {
  if (options?.abortSignal?.aborted) {
    throw new Error('Operation was aborted');
  }
  // process item
}
```

## How It Works

1. **User initiates cancellation**: User clicks "cancel" button in the chat UI
2. **AbortController activated**: The UI's abort controller calls `abort()`
3. **Signal propagates**: 
   - `VercelAi.stop()` → `abortController.abort()`
   - Signal passed through `executeToolCall()` to tool's `execute()` function
4. **Tool responds**:
   - **Fetch calls**: Automatically throw `AbortError` when signal is aborted
   - **Event listeners**: Custom controllers listen and abort internal timeouts
   - **Manual checks**: Tools check `options?.abortSignal?.aborted` in loops
5. **Error handling**: The tool execution catches the abort error and returns to the UI

## Testing

Built all affected packages successfully:
- ✅ `@openassistant/utils` - Core types and utilities
- ✅ `@openassistant/core` - Assistant core functionality
- ✅ `@openassistant/osm` - OpenStreetMap tools
- ✅ `@openassistant/places` - Places search tools
- ✅ `@openassistant/duckdb` - Database query tools
- ✅ `@openassistant/map` - Map data tools
- ✅ `@openassistant/geoda` - Spatial analysis tools

No TypeScript errors or linting issues found.

## Benefits

1. **Immediate Response**: Fetch operations are aborted immediately by the browser
2. **Resource Cleanup**: Long-running operations can be stopped mid-execution
3. **Better UX**: Users don't have to wait for tools to complete when they cancel
4. **Backwards Compatible**: Tools work normally when no abort signal is provided
5. **Consistent Pattern**: All tools follow the same abort signal pattern

## Future Enhancements

1. Add abort signal support to remaining tools (h3, plots, visualization tools)
2. Add more granular abort checks in very long-running operations
3. Consider adding progress callbacks that also check abort signal
4. Add comprehensive integration tests for abort functionality

## Example Usage

```typescript
// In the UI or application code
const abortController = new AbortController();

// Execute a tool with abort signal
const result = await geocoding.execute(
  { address: 'New York City' },
  { 
    toolCallId: 'call-123',
    abortSignal: abortController.signal 
  }
);

// User clicks cancel button
abortController.abort(); // Tool execution stops immediately
```
