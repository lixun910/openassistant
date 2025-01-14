import { useState, type ReactNode } from 'react';
import { Card, CardBody, Image } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { ConfigPanel } from '@openassistant/ui';

const codeGetStarted = `import { AiAssistant } from '@openassistant/ui';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      enableVoice={true}
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}`;

type HighlightFeature = {
  title: ReactNode;
  items: {
    image: string;
    icon: string;
    iconColor: string;
    iconLabel: string;
    code: string;
  }[];
};

export const highlightFeatures: HighlightFeature[] = [
  {
    title: (
      <>
        Add your own <span className="text-primary">AI Assistant</span> with
        ease
      </>
    ),
    items: [
      {
        image: '/img/getstart-model.png',
        icon: 'fa6-solid:robot',
        iconColor: 'text-purple-400',
        iconLabel: 'LLM Models',
        code: codeGetStarted,
      },
      {
        image: '/img/getstart-dark.png',
        icon: 'solar:moon-bold',
        iconColor: 'text-blue-400',
        iconLabel: 'Dark Mode',
        code: codeGetStarted,
      },
      {
        image: '/img/getstart-light.png',
        icon: 'solar:sun-bold',
        iconColor: 'text-amber-400',
        iconLabel: 'Light Mode',
        code: codeGetStarted,
      },
    ],
  },
  {
    title: (
      <>
        Supercharge your AI Assistant with{' '}
        <span className="text-secondary-400">Interactive</span> Capabilities
      </>
    ),
    items: [
      {
        iconLabel: 'Screenshot within App',
        image: '/img/screenshot-dark.png',
        icon: 'iconoir:screenshot',
        iconColor: 'text-orange-400',
        code: codeGetStarted,
      },
      {
        iconLabel: 'Voice to Text',
        image: '/img/voice-light.png',
        icon: 'icon-park-twotone:voice',
        iconColor: 'text-blue-400',
        code: codeGetStarted,
      },
      {
        iconLabel: 'Function Calling',
        image: '/img/geoda-dark.png',
        icon: 'catppuccin:folder-functions',
        iconColor: 'text-green-400',
        code: codeGetStarted,
      },
    ],
  },
  {
    title: (
      <>
        Extend your AI Assistant with{' '}
        <span className="text-warning">Plugins</span>
      </>
    ),
    items: [
      {
        iconLabel: 'Data Analysis (GeoDa)',
        image: '/img/geoda-light.png',
        icon: 'gravity-ui:geo-polygons',
        iconColor: 'text-blue-400',
        code: codeGetStarted,
      },
      {
        iconLabel: 'Plots (eCharts)',
        image: '/img/plots-dark.png',
        icon: 'ant-design:dot-chart-outlined',
        iconColor: 'text-blue-400',
        code: codeGetStarted,
      },
      {
        iconLabel: 'SQL Query (DuckDB)',
        image: '/img/sql-dark.png',
        icon: 'solar:database-bold',
        iconColor: 'text-blue-400',
        code: codeGetStarted,
      },
    ],
  },
];

export function HighlightFeatureComponent({ title, items }: HighlightFeature) {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleCardImageChange = (item: {
    image: string;
    icon: string;
    iconColor: string;
    iconLabel: string;
    code: string;
  }) => {
    setSelectedItem(item);
  };

  return (
    <div className="w-full mt-10 flex flex-col p-4 gap-4">
      <div className=" text-gray-600 dark:text-gray-100 font-bold leading-[1.2] tracking-tighter sm:text-[36px]">
        <div className="bg-hero-section-title bg-clip-text">{title}</div>
      </div>
      <div className="flex flex-row gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={'flex flex-col items-center cursor-pointer'}
            onClick={() => handleCardImageChange(item)}
          >
            <Icon
              icon={item.icon}
              className={`text-xl ${
                selectedItem.image === item.image
                  ? item.iconColor
                  : 'text-gray-400'
              }`}
              width={32}
              height={32}
            />
            <span className="text-sm text-gray-600">{item.iconLabel}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="w-[500px] min-w-[500px]">
          <Card>
            <CardBody className="p-4 flex justify-center items-center">
              {selectedItem.iconLabel == 'LLM Models' ? (
                <ConfigPanel onConfigChange={() => {}} />
              ) : (
                <Image
                  src={selectedItem.image}
                  alt="screenshot"
                  width={460}
                  className="rounded-none"
                />
              )}
            </CardBody>
          </Card>
        </div>
        <div className="w-[calc(100%-982px)] min-w-[500px]">
          <CopyBlock
            text={selectedItem.code}
            language="typescript"
            showLineNumbers={true}
            wrapLongLines={true}
            theme={dracula}
            customStyle={{
              overflowY: 'scroll',
              margin: '0px 0.75rem',
              borderRadius: '5px',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.35)',
              fontSize: '0.75rem',
            }}
          />
        </div>
      </div>
    </div>
  );
}
