import { useState, type ReactNode } from 'react';
import { Card, CardBody, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useColorMode } from '@docusaurus/theme-common';
import { CodeBlock } from './code-block';
import {
  codeGetStarted,
  codeGetStartedDark,
  codeConfig,
  codeScreenCapture,
  codeTailwind,
  codeVoiceToText,
  codeHistogram,
  codeSampleDataset,
  codeMap,
  codeSQL,
} from './code-content';

type FeatureItem = {
  image: string;
  icon: string;
  iconColor: string;
  iconLabel: string;
  code: CodeBlock;
};

type HighlightFeature = {
  title: ReactNode;
  items: FeatureItem[];
};

export const highlightFeatures: HighlightFeature[] = [
  {
    title: <>Powerful tools for data analysis</>,
    items: [
      {
        iconLabel: 'Plots',
        image: '/img/plots-dark.png',
        icon: 'ant-design:dot-chart-outlined',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeHistogram,
          },
          {
            title: 'test-data.json',
            content: codeSampleDataset,
          },
        ],
      },
      {
        iconLabel: 'Maps',
        image: '/img/geoda-light.png',
        icon: 'gravity-ui:geo-polygons',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeMap,
          },
          {
            title: 'my-datasets.ts',
            content: codeSampleDataset,
          },
        ],
      },
      {
        iconLabel: 'SQL Query',
        image: '/img/sql-dark.png',
        icon: 'solar:database-bold',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeSQL,
          },
          {
            title: 'my-datasets.ts',
            content: codeSampleDataset,
          },
        ],
      },
      {
        iconLabel: 'Geo Tools',
        image: '/img/geo-tools.png',
        icon: 'wpf:geo-fence',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeSQL,
          },
          {
            title: 'my-datasets.ts',
            content: codeSampleDataset,
          },
        ],
      },
      {
        iconLabel: 'Data Analysis',
        image: '/img/geoda-tool.png',
        icon: 'carbon:data-vis-1',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeMap,
          },
          {
            title: 'my-datasets.ts',
            content: codeSampleDataset,
          },
        ],
      },
    ],
  },
  {
    title: <>Interactive React chat component</>,
    items: [
      {
        image: '/img/getstart-light.png',
        icon: 'solar:sun-bold',
        iconColor: 'text-amber-400',
        iconLabel: 'Light Mode',
        code: [
          {
            title: 'page.tsx',
            content: codeGetStarted,
          },
          {
            title: 'tailwind.config.js (optional)',
            content: codeTailwind,
          },
        ],
      },
      {
        image: '/img/getstart-dark.png',
        icon: 'solar:moon-bold',
        iconColor: 'text-blue-400',
        iconLabel: 'Dark Mode',
        code: [
          {
            title: 'page.tsx',
            content: codeGetStartedDark,
          },
          {
            title: 'tailwind.config.js (optional)',
            content: codeTailwind,
          },
        ],
      },
      {
        image: '/img/getstart-model.png',
        icon: 'fa6-solid:robot',
        iconColor: 'text-purple-400',
        iconLabel: 'LLM Models',
        code: [
          {
            title: 'config.tsx',
            content: codeConfig,
          },
          {
            title: 'page.tsx',
            content: codeGetStarted,
          },
          {
            title: 'tailwind.config.js (optional)',
            content: codeTailwind,
          },
        ],
      },
      {
        iconLabel: 'Screenshot within App',
        image: '/img/screenshot-dark.png',
        icon: 'iconoir:screenshot',
        iconColor: 'text-orange-400',
        code: [
          {
            title: 'page.tsx',
            content: codeScreenCapture,
          },
        ],
      },
      {
        iconLabel: 'Voice to Text',
        image: '/img/voice-light.png',
        icon: 'icon-park-twotone:voice',
        iconColor: 'text-blue-400',
        code: [
          {
            title: 'page.tsx',
            content: codeVoiceToText,
          },
        ],
      },
    ],
  },
];

export function HighlightFeatureComponent({ title, items }: HighlightFeature) {
  const { setColorMode } = useColorMode();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCardImageChange = (item: FeatureItem, index: number) => {
    setSelectedIndex(index);
    if (item.iconLabel === 'Dark Mode') {
      setColorMode('dark');
    } else if (item.iconLabel === 'Light Mode') {
      setColorMode('light');
    }
  };

  return (
    <div className="w-10/12 mt-0 flex flex-col p-4 gap-4 items-center">
      <div className=" text-gray-600 dark:text-gray-100 font-bold leading-[1.2] tracking-tighter sm:text-[36px]">
        <div className="bg-hero-section-title bg-clip-text">{title}</div>
      </div>
      <div className="flex flex-row gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={'flex flex-col items-center cursor-pointer'}
            onClick={() => handleCardImageChange(item, index)}
          >
            <Icon
              icon={item.icon}
              className={`text-xl ${
                selectedIndex === index ? item.iconColor : 'text-gray-400'
              }`}
              width={32}
              height={32}
            />
            <span className="text-sm text-gray-600">{item.iconLabel}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="min-w-[340px]">
          <Card>
            <CardBody className="p-4 flex justify-center items-center">
              <Image
                src={items[selectedIndex].image}
                alt="screenshot"
                className="rounded-none max-w-full h-auto object-contain"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
