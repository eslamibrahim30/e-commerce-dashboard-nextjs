import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


interface Column<T> {
  header: string;
  accessor: keyof T | string; 
  render?: (item: T) => React.ReactNode; 
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
}

export default function ReusableTable<T>({ columns, data, actions }: ReusableTableProps<T>) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden transition-all">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {columns.map((col, index) => (
              <TableHead key={index} className="font-bold text-foreground py-4">
                {col.header}
              </TableHead>
            ))}
            {actions && <TableHead className="text-right py-4">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-primary/5 transition-colors group">
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="py-3 text-muted-foreground group-hover:text-foreground">
                    {col.render ? col.render(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right py-3">
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (actions ? 1 : 0)} 
                className="h-24 text-center text-muted-foreground"
              >
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}