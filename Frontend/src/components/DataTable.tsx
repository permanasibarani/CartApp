"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Data type for Payment
export type Payment = {
  cart_id: number;
  name: string;
  type: string;
  productPrice: number;
  qty: number;
  price: number;
};

interface DataTableDemoProps {
  username: string;
}

export function DataTableDemo({ username }: DataTableDemoProps) {
  const [cartData, setCartData] = React.useState<Payment[]>([]); // State to hold fetched cart data
  const [page, setPage] = React.useState(0); // Page currently displayed
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedItems, setSelectedItems] = React.useState<
    { name: string; qty: number }[]
  >([]);
  const [table, setTable] = React.useState<any>(null); // State to store table instance

  // Handle selection change to update selected items
  React.useEffect(() => {
    if (table) {
      // Ensure table is defined before accessing it
      const selected = table
        .getRowModel()
        .rows.filter((row) => row.getIsSelected())
        .map((row) => ({
          name: row.getValue("name"),
          qty: row.getValue("qty"),
        }));
      setSelectedItems(selected);
    }
  }, [table]); // Only depend on `table`, not `table.getRowModel().rows`
  // Handle order creation
  const handleCreateOrder = async () => {
    const orderData = {
      username,
      data: selectedItems,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/cart/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Order created successfully!");
      } else {
        alert("Error creating order: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create order");
    }
  };
  // Fetch cart data based on username
  const fetchCartData = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/cart/all?username=${username}&page=${page}&size=${3}`
      );
      const result = await response.json();
      setCartData(result.data); // Update table data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when page changes
  React.useEffect(() => {
    fetchCartData(page, 3); // Fetch 3 items per page
  }, [page]);

  // Handle page change
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePreviousPage = () =>
    setPage((prevPage) => Math.max(prevPage - 1, 0));

  // Columns for table
  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="h-5 w-5 text-blue-600 border-gray-300 rounded bg-white data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="h-5 w-5 text-blue-600 border-gray-300 rounded bg-white data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nama Produk",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "productPrice",
      header: () => <div className="text-right">Product Price</div>,
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("productPrice"));

        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "IDR",
        }).format(price);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "qty",
      header: () => <div className="text-right">QTY</div>,
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("qty")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Total Price</div>,
      cell: ({ row }) => {
        const totalPrice = Number.parseFloat(row.getValue("price"));

        const formattedTotal = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "IDR",
        }).format(totalPrice);

        return <div className="text-right font-medium">{formattedTotal}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(payment.cart_id.toString())
                }
              >
                Copy cart ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View product details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  // Table setup using react-table
  const tableInstance = useReactTable({
    data: cartData, // Using the state data for the table
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    setTable(tableInstance); // Set the table instance after it is created
  }, [tableInstance]);

  return (
    <div className="w-full">
      {/* JSX for rendering the table */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter type..."
          value={(table?.getColumn("type")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn("type")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {/* Dropdown for selecting columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              ?.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-4" onClick={fetchCartData}>
          Refresh Cart
        </Button>
      </div>

      <Table>
        <TableHeader>
          {table?.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table?.getRowModel().rows.length ? (
            table?.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={handleNextPage}>
          Next
        </Button>
      </div>
      <div className="flex justify-end p-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handleCreateOrder}
          disabled={selectedItems.length === 0}
        >
          Create Order
        </Button>
      </div>
    </div>
  );
}

export default DataTableDemo;
