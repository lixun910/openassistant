# OpenAssistant

OpenAssistant is a powerful React library that helps transform React applications into AI-powered applications with minimal setup. 

Check out the following examples using OpenAssistant in action:
| kepler.gl AI Assistant (kepler.gl) |  GeoDa.AI AI Assistant (geoda.ai)    |
|----|----|
| [<img width="215" alt="Screenshot 2024-12-08 at 9 12 22 PM" src="https://github.com/user-attachments/assets/edc11aee-8945-434b-bec9-cc202fee547c">](https://kepler.gl) |  [<img width="240" alt="Screenshot 2024-12-08 at 9 13 43 PM" src="https://github.com/user-attachments/assets/de418af5-7663-48fb-9410-74b4750bc944">](https://geoda.ai) |

## 🌟 Features

- 🤖 **Multiple AI Provider Support**
  - OpenAI (GPT models)
  - Google Gemini
  - Ollama (local AI models)
- 🎯 **Advanced Capabilities**
  - Take screenshot to ask [[Demo]](https://geoda.ai/img/highlight-screenshot.mp4)
  - Talk to ask [[Demo]](https://geoda.ai/img/highlight-ai-talk.mp4)
  - Function calling support [[Demo]](https://geoda.ai/img/highlight-prompt.mp4)
- 🌟 **AI Assistant Plugins**
  - DuckDB: in-browser query data using duckdb
  - ECharts: visualize data using echarts
  - GeoDa: apply spatial data analysis using geoda wasm
- 🎨 **Customizable UI Components**
  - Pre-built chat interface
  - Pre-built LLM configuration interface
  - Screenshot wrapper for your app
  - Theme support
- 📦 **Easy Integration**
  - CLI tool for adding components
  - TypeScript support
  - Tailwind CSS integration

## 📦 Installation

```bash
# Install the core package
npm install @openassistant/ui @langchain/core @langchain/google-genai @langchain/ollama @langchain/openai html2canvas
```

## 🚀 Quick Start

```jsx
import { AiAssistant } from '@openassistant/ui';
import '@openassistant/ui/dist/styles.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```

## 📚 Packages

- **@openassistant/ui**: Pre-built chat UI components
- **@openassistant/core**: Core functionality and hooks
- **@openassistant/cli**: CLI tool for adding components to your project
- **@openassistant/duckdb**: DuckDB integration for data querying

## 🛠️ Using the CLI

Add the chat components to your React project:

```bash
npx add-ai-chat
```

The CLI will help you set up the components and required dependencies.

## 🔧 Requirements

Your project should have these dependencies:

- react
- @langchain/core
- @langchain/google-genai
- @langchain/ollama
- @langchain/openai
- html2canvas
- next-themes
- @nextui-org/react
- framer-motion

## 📖 Documentation

For detailed documentation and examples, visit our package-specific READMEs:

- [Core Package](packages/core/README.md)
- [UI Components](packages/ui/README.md)
- [CLI Tool](cli/README.md)
- [DuckDB Addon](packages/duckdb/README.md)
- [GeoDa Addon](packages/duckdb/README.md)
- [eCharts Addon](packages/duckdb/README.md)

## 🎯 Examples

Check out our example projects:
- [Simple React Example](examples/simple_react/README.md)
- [React with TailwindCSS Example](examples/react_tailwind/README.md)

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)
