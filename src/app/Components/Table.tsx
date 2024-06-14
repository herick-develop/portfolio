import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

interface TableColumn {
  id: number;
  title?: string;
  plataform?: string;
  description: string;
  link?: string;
};

interface TabelaProps {
  tableData: TableColumn[];
}
  
  export default function Tabela({ tableData }: TabelaProps) {

    if (!Array.isArray(tableData) || tableData.length === 0) {
      return <></>;
    }
  
    const headers = Object.keys(tableData[0]);
  
    return (
      <Table className="h-[90%] w-[94%] m-auto border-[1px] border-[#202020]">
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="text-white border-[1px] border-[#202020] bg-[#363636] select-none cursor-n-resize">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="h-[10%]">
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="h-[10%]">
              {headers.map((header, index) => {
                const cellValue = row[header as keyof TableColumn];
                return (
                  <TableCell key={index} className="font-medium text-[#c1c1c4] border-[1px] border-[#202020] bg-[#5B5B5B] select-none cursor-n-resize">
                    {cellValue != null && cellValue.toString().length > 24
                      ? `${decodeURIComponent(escape(cellValue.toString())).slice(0, 24)}...`
                      : decodeURIComponent(escape(cellValue?.toString() || ''))}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }