import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn<T> {
  key: string;
  header: string;

  render: (row: T) => ReactNode;

  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  getRowKey: (row: T) => string;

  loading?: boolean;

  headerColorClass?: string;

  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,

  loading = false,

  headerColorClass = "text-primary",

  emptyTitle = "No hay registros",
  emptyDescription = "No se encontraron resultados.",
  emptyIcon,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <p className="text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          {emptyIcon}

          <h3 className="mt-4 text-lg font-semibold">
            {emptyTitle}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {emptyDescription}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardContent className="p-0">
        <div className="px-4 pb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`
                      h-14
                      text-center
                      font-bold
                      uppercase
                      tracking-wide
                      ${headerColorClass}
                      ${column.headerClassName ?? ""}
                    `}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className="h-16 transition-colors hover:bg-muted/40"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`
                        text-center
                        ${column.cellClassName ?? ""}
                      `}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}