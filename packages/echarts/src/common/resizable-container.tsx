import { Resizable } from "re-resizable";

export function ResizablePlotContainer({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <div className="w-full mt-4 mb-8">
      <Resizable
        defaultSize={{
          width: '100%',
          height: 280,
        }}
        minHeight={280}
        maxHeight={600}
        enable={{ bottom: true, bottomRight: true, right: false }}
        handleComponent={{
          bottomRight: (
            <div className="group absolute bottom-0 right-0 h-6 w-6 cursor-se-resize">
              <div className="flex h-full w-full items-center justify-center transition-colors hover:bg-gray-100/10">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  className="text-gray-300 group-hover:text-gray-400"
                >
                  <path
                    d="M11 6V11H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ),
        }}
      >
        {children}
      </Resizable>
    </div>
  );
}
