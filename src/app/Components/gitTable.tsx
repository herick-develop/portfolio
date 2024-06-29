import React, { useState, useEffect } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

interface TabelaProps {
  columns?: [];
  lines?: [];
  colrows: { name: string; url?: string; }[]; 
}
  
const GitTable: React.FC<TabelaProps> = ({ columns, lines, colrows}) => {

  const [cols, setCols] = useState<string[]>([]);

  useEffect(() => {
    if (colrows) {
      colrows.map( ( colrow ) => {
        setCols(Object.keys(colrow));
      })
    } else if (columns) {
      setCols(columns);
    }

  }, [colrows, columns]);

  if (!cols.length) {
    return <></>;
  }

  return (

    <Table className="h-full w-[94%] m-auto border-[1px] border-[#202020]">

    <TableHeader>

        <TableRow>

          <TableHead className="text-white border-[1px] border-[#202020] bg-[#363636] select-none cursor-n-resize">
          <p>id</p>
          </TableHead>

        {cols.map((col, index) => (
            <TableHead key={index} className="text-white border-[1px] border-[#202020] bg-[#363636] select-none cursor-n-resize">
            {col}
            </TableHead>
        ))}
        </TableRow>
    </TableHeader>

    <TableBody className="h-[10%]">

        {colrows.map((row:any, rowIndex) => (
        <TableRow key={rowIndex} className="h-[10%]">
            <TableCell className="font-medium text-[#c1c1c4] border-[1px] border-[#202020] bg-[#5B5B5B] select-none cursor-n-resize">
                {rowIndex+1}
            </TableCell>
            {cols.map((header, index) => {
                const cellValue = row[header as keyof TabelaProps];
                return (
                    <TableCell key={index} className="font-medium text-[#c1c1c4] border-[1px] border-[#202020] bg-[#5B5B5B] select-none cursor-n-resize">
                        {
                          cellValue != null && cellValue.toString().length > 64
                            ? `${decodeURIComponent(encodeURIComponent(cellValue.toString())).slice(12, 64)}...`
                            : decodeURIComponent(encodeURIComponent(cellValue?.toString() || ''))
                        }
                    </TableCell>
                );
            })}
        </TableRow>
        ))}

    </TableBody>

    </Table>
);}
export default GitTable;
