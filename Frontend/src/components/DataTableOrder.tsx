import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Data type for Order
export type Order = {
  order_id: number;
  order_date: string;
  total_price: number;
};

interface DataTableDemoProps {
  username: string; // Username passed from the parent component
}

export function DataTableOrder({ username }: DataTableDemoProps) {
  const [orderData, setOrderData] = React.useState<Order[]>([]);
  const [page, setPage] = React.useState<number>(0);

  // Fetch orders data
  const fetchOrderData = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/orders/${username}?page=${page}&size=10`
      );
      const result = await response.json();
      setOrderData(result); // Directly use the result if the structure is an array
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const handleRefresh = () => {
    fetchOrderData(page); // Fetch data again to refresh
  };

  React.useEffect(() => {
    fetchOrderData(page); // Fetch order data when the page number changes
  }, [page, username]);

  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 0));

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_id", // Update with the actual key
      header: "Order ID",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("order_id")}</div>
      ),
    },
    {
      accessorKey: "order_date", // Update with the actual key
      header: "Order Date",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("order_date")).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "total_price", // Update with the actual key
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => {
        const total = row.getValue("total_price");
        return <div className="text-right font-medium">{total.toFixed(2)}</div>;
      },
    },
  ];

  const tableInstance = useReactTable({
    data: orderData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pageIndex: page },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Order List</h1>
        <Button onClick={handleRefresh}>Refresh</Button> {/* Refresh Button */}
      </div>
      <Table>
        <TableHeader>
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {tableInstance.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
