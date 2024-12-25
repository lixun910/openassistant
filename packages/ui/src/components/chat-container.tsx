import { ThemeProvider } from 'next-themes';

export function ChatContainer({
  children,
  theme,
}: {
  children: JSX.Element;
  theme: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      {children}
    </ThemeProvider>
  );
}
