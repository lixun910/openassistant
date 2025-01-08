import { useMemo, useState } from 'react';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
} from '@nextui-org/react';
import '../../index.css';

export type SpatialCountComponentProps = {
  joinResult: number[][];
  joinValues?: Record<string, number[]>;
  actionButtonLabel?: string;
  actionButtonOnClick?: () => void;
};

export function SpatialCountComponent({
  joinResult,
  joinValues,
  actionButtonLabel,
  actionButtonOnClick,
}: SpatialCountComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;
  const pages = Math.ceil(joinResult.length / rowsPerPage);

  const itemsOnPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return joinResult.slice(start, end);
  }, [page, joinResult]);

  return error ? (
    <div>
      <p className="text-tiny">Something went wrong:</p>
      {error}
    </div>
  ) : (
    <div className="flex flex-col gap-4 max-w-full">
      <Table
        aria-label="Query Result Table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
              size="sm"
              hidden={pages <= 1}
            />
          </div>
        }
        classNames={{
          wrapper: 'max-h-[440px] max-w-full overflow-x-auto rounded-none',
          base: 'overflow-scroll p-0 m-0 text-tiny',
          table: 'p-0 m-0 text-tiny',
          th: 'text-tiny',
          td: 'text-[9px]',
        }}
        isHeaderSticky
        selectionMode="multiple"
        selectionBehavior="replace"
        disallowEmptySelection={false}
      >
        <TableHeader>
          {Object.keys(joinValues || {}).map((variable) => (
            <TableColumn key={variable}>{variable}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {itemsOnPage.map((row, index) => (
            <TableRow key={index}>
              {Object.keys(joinValues || {}).map((variable) => (
                <TableCell key={variable} style={{ position: 'relative' }}>
                  {joinValues?.[variable]?.[index]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {actionButtonLabel && actionButtonOnClick && joinValues && (
        <div className="flex justify-end">
          <Button color="secondary" onClick={() => actionButtonOnClick()}>
            {actionButtonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
