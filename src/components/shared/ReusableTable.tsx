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
    
    <div className="w-full rounded-[2rem] border border-border/50 bg-card shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <Table className="min-w-[600px] md:min-w-full">
          
          
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-none">
              {columns.map((col, index) => (
                <TableHead key={index} className="font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground py-5 px-6">
                  {col.header}
                </TableHead>
              ))}
              {actions && <TableHead className="text-right py-5 px-6 font-black text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-primary/[0.02] border-border/40 transition-colors group">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} className="py-4 px-6 text-sm font-medium text-foreground/80">
                      {col.render ? col.render(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right py-4 px-6">
                      <div className="flex justify-end gap-2">
                        {actions(item)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="h-32 text-center text-muted-foreground font-medium"
                >
                  No data discovered in the forest. 🌳
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}