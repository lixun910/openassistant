import type { Meta, StoryObj } from '@storybook/react';
import { ConfigPanel, AiAssistantConfig } from '@openassistant/ui';
import { ThemeProvider } from 'next-themes';

const meta: Meta<typeof ConfigPanel> = {
  title: 'Assistant/ConfigPanel',
  component: ConfigPanel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A configuration panel component that allows users to manage assistant settings.
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfigPanel>;

const sampleConfig: AiAssistantConfig = {
  isReady: false,
  provider: 'openai',
  model: 'gpt-4',
  temperature: 0.7,
  topP: 0.9,
  apiKey: 'sk-1234567890',
  baseUrl: 'http://127.0.0.1:11434',
};

export const Default: Story = {
  render: () => (
    <ThemeProvider
      attribute="class"
      forcedTheme="light"
      defaultTheme="light"
      enableSystem={false}
    >
      <ConfigPanel
        initialConfig={sampleConfig}
        onConfigChange={(newConfig) =>
          console.log('Config changed:', newConfig)
        }
      />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the configuration panel with default settings.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ThemeProvider
      attribute="class"
      forcedTheme="dark"
      defaultTheme="dark"
      enableSystem={false}
    >
      <ConfigPanel
        initialConfig={sampleConfig}
        onConfigChange={(newConfig) =>
          console.log('Config changed:', newConfig)
        }
      />
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Configuration panel with no initial config provided.',
      },
    },
  },
};
