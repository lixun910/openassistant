# @openassistant/chat

## Optional xAI provider

- This package can work with multiple providers via the AI SDK v5.
- If you intend to use xAI, install the optional peer dependency in your app:

```bash
yarn add @ai-sdk/xai
# or
npm install @ai-sdk/xai
```

## Build and bundling notes

- The package treats `@ai-sdk/xai` as external and optional.
- Consumers who use xAI must install `@ai-sdk/xai` so their bundler can resolve it.
