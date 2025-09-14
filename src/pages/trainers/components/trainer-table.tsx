import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  type FilterFn,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";
import { DataTablePagination } from "./data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, X } from "lucide-react";
import { Trainer } from "@/api/trainers";

interface TrainersTableProps {
  data: Trainer[];
  onEdit: (t: Trainer) => void;
  onDelete: (t: Trainer) => void;
  className?: string;
}

export function TrainersTable({
  data,
  onEdit,
  onDelete,
  className,
}: TrainersTableProps) {
  const departmentOptions = React.useMemo(
    () =>
      Array.from(new Set(data.map((d) => d.department).filter(Boolean))).sort(),
    [data]
  );
  const statusOptions = ["active", "inactive"] as const;

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const globalFilterFn: FilterFn<Trainer> = React.useCallback(
    (row, _col, value) => {
      const search = (value as string).toLowerCase();
      if (!search) return true;
      return ["fullname", "email", "position", "department"].some((key) => {
        const v = row.getValue<any>(key);
        return v ? String(v).toLowerCase().includes(search) : false;
      });
    },
    []
  );

  const columns = React.useMemo<ColumnDef<Trainer>[]>(
    () => [
      {
        accessorKey: "fullname",
        header: "Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
        meta: { className: "min-w-[160px]" },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">
            {info.getValue() as string}
          </span>
        ),
        meta: { className: "min-w-[160px]" },
      },
      {
        accessorKey: "position",
        header: "Position",
        cell: (info) => info.getValue() || "-",
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue() || "-",
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          return row.getValue(columnId) === value;
        },
        meta: { className: "hidden lg:table-cell" },
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => (row.is_active ? "Active" : "Inactive"),
        cell: (info) =>
          info.getValue() === "Active" ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Inactive
            </span>
          ),
        filterFn: (row, _columnId, value) => {
          if (!value) return true;
          return value === "active"
            ? row.original.is_active
            : !row.original.is_active;
        },
        meta: { className: "hidden sm:table-cell" },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        ),
        size: 160,
        meta: { className: "text-right" },
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const departmentFilter = table.getColumn("department")?.getFilterValue() as
    | string
    | undefined;
  const statusFilter = table.getColumn("status")?.getFilterValue() as
    | string
    | undefined;
  const hasActiveFilters =
    !!globalFilter || !!departmentFilter || !!statusFilter;

  const clearFilters = () => {
    setGlobalFilter("");
    table.getColumn("department")?.setFilterValue(undefined);
    table.getColumn("status")?.setFilterValue(undefined);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        role="toolbar"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="flex-1 max-w-[260px]">
            <Input
              placeholder="Search trainers..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={departmentFilter ?? undefined}
              onValueChange={(v) => {
                if (v === "__all")
                  table.getColumn("department")?.setFilterValue(undefined);
                else table.getColumn("department")?.setFilterValue(v);
              }}
            >
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Departments</SelectItem>
                {departmentOptions.map((d) => (
                  <SelectItem key={d} value={d!}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter ?? undefined}
              onValueChange={(v) => {
                if (v === "__all")
                  table.getColumn("status")?.setFilterValue(undefined);
                else table.getColumn("status")?.setFilterValue(v);
              }}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Status</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "active" ? "Active" : "Inactive"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>
        {/* <div className="text-xs text-muted-foreground md:text-sm">
          {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length === 1 ? '' : 's'}
        </div> */}
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[720px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted whitespace-nowrap",
                      (header.column.columnDef.meta as any)?.className ?? ""
                    )}
                  >
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted whitespace-nowrap text-xs sm:text-sm",
                        (cell.column.columnDef.meta as any)?.className ?? ""
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground"
                >
                  {hasActiveFilters
                    ? "No trainers match the current filters."
                    : "No trainers found."}
                  {hasActiveFilters && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
