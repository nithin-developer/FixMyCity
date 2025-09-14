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
import {Edit2, Trash2, X } from "lucide-react";

export interface StudentRow {
  id: string;
  usn: string;
  full_name: string;
  email?: string;
  phone?: string;
  branch?: string;
  section?: string;
}

interface StudentsTableProps {
  data: StudentRow[];
  onEdit: (row: StudentRow) => void;
  onDelete: (row: StudentRow) => void;
  className?: string;
}

export function StudentsTable({
  data,
  onEdit,
  onDelete,
  className,
}: StudentsTableProps) {
  // Unique filter option lists
  const branchOptions = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.branch).filter(Boolean))).sort(),
    [data]
  );
  const sectionOptions = React.useMemo(
    () =>
      Array.from(new Set(data.map((d) => d.section).filter(Boolean))).sort(),
    [data]
  );

  // Filtering state
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const globalFilterFn: FilterFn<StudentRow> = React.useCallback(
    (row, _columnId, filterValue) => {
      const search = (filterValue as string).toLowerCase();
      if (!search) return true;
      return ["usn", "full_name", "email", "branch", "section"].some((key) => {
        const v = row.getValue<any>(key);
        return v ? String(v).toLowerCase().includes(search) : false;
      });
    },
    []
  );

  const columns = React.useMemo<ColumnDef<StudentRow>[]>(
    () => [
      {
        accessorKey: "usn",
        header: "USN",
        cell: (info) => (
          <span className="font-mono text-xs sm:text-sm">
            {info.getValue() as string}
          </span>
        ),
        meta: { className: "whitespace-nowrap" },
      },
      {
        accessorKey: "full_name",
        header: "Name",
        meta: { className: "min-w-[140px]" },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue() || "-",
        meta: { className: "hidden lg:table-cell" },
      },
      {
        accessorKey: "branch",
        header: "Branch",
        cell: (info) => info.getValue() || "-",
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          return row.getValue(columnId) === value;
        },
        meta: { className: "hidden sm:table-cell" },
      },
      {
        accessorKey: "section",
        header: "Section",
        cell: (info) => info.getValue() || "-",
        filterFn: (row, columnId, value) => {
          if (!value) return true;
          return row.getValue(columnId) === value;
        },
        meta: { className: "hidden md:table-cell" },
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
             <Edit2 className="h-4 w-4" /> Edit 
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
        size: 140,
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
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const branchFilter = table.getColumn("branch")?.getFilterValue() as
    | string
    | undefined;
  const sectionFilter = table.getColumn("section")?.getFilterValue() as
    | string
    | undefined;
  const hasActiveFilters = !!globalFilter || !!branchFilter || !!sectionFilter;

  const clearFilters = () => {
    setGlobalFilter("");
    table.getColumn("branch")?.setFilterValue(undefined);
    table.getColumn("section")?.setFilterValue(undefined);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div
        className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        role="toolbar"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-1">
          <div className="flex-1 max-w-[250px] ">
            <Input
              placeholder="Search students..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={branchFilter ?? undefined}
              onValueChange={(v) => {
                if (v === "__all")
                  table.getColumn("branch")?.setFilterValue(undefined);
                else table.getColumn("branch")?.setFilterValue(v);
              }}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Branches</SelectItem>
                {branchOptions.map((b) => (
                  <SelectItem key={b} value={b!}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sectionFilter ?? undefined}
              onValueChange={(v) => {
                if (v === "__all")
                  table.getColumn("section")?.setFilterValue(undefined);
                else table.getColumn("section")?.setFilterValue(v);
              }}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Sections</SelectItem>
                {sectionOptions.map((s) => (
                  <SelectItem key={s} value={s!}>
                    {s}
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

      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
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
                    ? "No students match the current filters."
                    : "No students found."}
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
