import { AiAssistant } from '@openassistant/ui';
import '@openassistant/ui/dist/index.css';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark">
      <div style={{ width: '400px', height: '800px', margin: '20px' }}>
        <AiAssistant
          name="My Assistant"
          apiKey=""
          version="v1"
          modelProvider="ollama"
          model="llama3.1"
          baseUrl="http://127.0.0.1:11434"
          welcomeMessage="Hello, how can I help you today?"
          instructions="You are a helpful assistant."
          functions={[]}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
