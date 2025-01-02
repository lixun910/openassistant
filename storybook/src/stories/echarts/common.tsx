import { ResizablePlotContainer} from "@openassistant/echarts";
import { ThemeProvider } from 'next-themes';

export function ThemeWrapper({ 
  children, 
  forcedTheme = "light" 
}: { 
  children: JSX.Element;
  forcedTheme?: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      forcedTheme={forcedTheme}
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="common-wrapper w-[400px] h-[600px]">
        <ResizablePlotContainer>
          {children}
        </ResizablePlotContainer>
      </div>
    </ThemeProvider>
  );
}
