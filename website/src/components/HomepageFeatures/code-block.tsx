import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

export type CodeBlock = {
  title: string;
  content: string;
}[];

export function CodeBlock({ code }: { code: CodeBlock }) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onCodeTitleClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="w-full flex flex-col gap-1 h-full">
      <div className="flex flex-row gap-2 mt-1 ml-3">
        {code.map((item, index) => (
          <div
            key={index}
            className="text-sm cursor-pointer text-white bg-gray-800 px-2 py-1 rounded-md w-fit"
            onClick={() => onCodeTitleClick(index)}
          >
            {item.title}
          </div>
        ))}
      </div>
      <CopyBlock
        key={selectedIndex}
        text={code[selectedIndex].content}
        language="javascript"
        showLineNumbers={true}
        wrapLongLines={false}
        theme={dracula}
        customStyle={{
          maxHeight: '340px',
          overflowY: 'scroll',
          overflowX: 'scroll',
          margin: '0px 0.75rem',
          borderRadius: '5px',
          boxShadow: '1px 2px 3px rgba(0,0,0,0.35)',
          fontSize: '0.75rem',
        }}
      />
    </div>
  );
}
