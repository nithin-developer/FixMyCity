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
import { Check, Download, Edit, Eye, Pencil, Trash2, X } from "lucide-react";

// Issue interface representing the shape used in IssuesPage
export interface IssueRow {
  id: string;
  issueType: string;
  description: string;
  location: string;
  status: string; // Open | In Progress | Resolved | Acknowledged
  submittedBy: string;
  date: string; // DD-MM-YYYY
  priority: string; // High | Medium | Low
}

// Report rows
export interface ReportRow {
  slNo: number;
  startDate: string; // DD-MM-YYYY
  endDate: string; // DD-MM-YYYY
  comments?: string;
  createdAt?: string;
}

// Admin rows
export interface AdminRow {
  id: string;
  name: string;
  email: string;
  role: string; // Administrator | Super Admin etc.
  active?: boolean;
}

// Issues table (react-table) -----------------------------------------

interface IssuesTableProps {
  data: IssueRow[];
  onEdit: (issue: IssueRow) => void;
  onDelete: (issue: IssueRow) => void;
  className?: string;
}

export function IssuesTable({
  data,
  onEdit,
  onDelete,
  className,
}: IssuesTableProps) {
  const statusOptions = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.status))).sort(),
    [data]
  );
  const typeOptions = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.issueType))).sort(),
    [data]
  );

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const globalFilterFn: FilterFn<IssueRow> = React.useCallback(
    (row, _col, value) => {
      const search = (value as string).toLowerCase();
      if (!search) return true;
      return [
        "issueType",
        "description",
        "submittedBy",
        "location",
        "priority",
        "status",
      ].some((key) => {
        const v = row.getValue<any>(key);
        return v ? String(v).toLowerCase().includes(search) : false;
      });
    },
    []
  );

  const columns = React.useMemo<ColumnDef<IssueRow>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Issue ID",
        cell: (info) => (
          <span className="font-medium">{info.getValue() as string}</span>
        ),
        meta: { className: "min-w-[60px]" },
      },
      {
        accessorKey: "issueType",
        header: "Type",
        cell: (info) => info.getValue() as string,
        meta: { className: "min-w-[140px]" },
        filterFn: (row, columnId, value) =>
          !value || row.getValue(columnId) === value,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = (info.getValue() as string) || "";
          const lower = value.toLowerCase();
          const badgeClass =
            lower === "open"
              ? "bg-red-100 text-red-700"
              : lower === "in progress"
                ? "bg-blue-100 text-blue-700"
                : lower === "resolved"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700";
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
            >
              {value}
            </span>
          );
        },
        filterFn: (row, columnId, value) =>
          !value || row.getValue(columnId) === value,
        meta: { className: "min-w-[120px]" },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: (info) => {
          const value = (info.getValue() as string) || "";
          const lower = value.toLowerCase();
          const badgeClass =
            lower === "high"
              ? "bg-red-50 text-red-600 border border-red-200"
              : lower === "medium"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-50 text-gray-600 border border-gray-200";
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${badgeClass}`}
            >
              {value}
            </span>
          );
        },
        meta: { className: "hidden md:table-cell" },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => info.getValue() as string,
        meta: { className: "hidden lg:table-cell" },
      },
      {
        accessorKey: "submittedBy",
        header: "Reporter",
        cell: (info) => <span>{info.getValue() as string}</span>,
        meta: { className: "min-w-[100px]" },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`View issue ${row.original.id}`)}
            >
              {" "}
              <Eye className="h-4 w-4" /> View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              {" "}
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(row.original)}
            >
              {" "}
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        ),
        size: 100,
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

  const typeFilter = table.getColumn("issueType")?.getFilterValue() as
    | string
    | undefined;
  const statusFilter = table.getColumn("status")?.getFilterValue() as
    | string
    | undefined;
  const hasActiveFilters = !!globalFilter || !!typeFilter || !!statusFilter;

  const clearFilters = () => {
    setGlobalFilter("");
    table.getColumn("issueType")?.setFilterValue(undefined);
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
              placeholder="Search issues..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={typeFilter ?? undefined}
              onValueChange={(v) => {
                if (v === "__all")
                  table.getColumn("issueType")?.setFilterValue(undefined);
                else table.getColumn("issueType")?.setFilterValue(v);
              }}
            >
              <SelectTrigger className="h-9 w-[170px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
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
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Status</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
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
        <Table className="min-w-[600px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="group/row">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "bg-background group-hover/row:bg-muted whitespace-nowrap",
                      (header.column.columnDef.meta as any)?.className || ""
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
                        "bg-background group-hover/row:bg-muted whitespace-nowrap text-xs sm:text-sm",
                        (cell.column.columnDef.meta as any)?.className || ""
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
                    ? "No issues match the current filters."
                    : "No issues found."}
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

// Reports table ------------------------------------------------------
interface ReportsTableProps {
  data: ReportRow[];
  onDownload: (row: ReportRow) => void;
  onDelete: (row: ReportRow) => void;
  className?: string;
}

export function ReportsTable({
  data,
  onDownload,
  onDelete,
  className,
}: ReportsTableProps) {
  const columns = React.useMemo<ColumnDef<ReportRow>[]>(
    () => [
      {
        accessorKey: "slNo",
        header: "Sl. No",
        cell: (info) => (
          <span className="font-medium">{info.getValue<number>()}</span>
        ),
        meta: { className: "min-w-[70px]" },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: (info) => info.getValue() as string,
        meta: { className: "min-w-[120px]" },
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: (info) => info.getValue() as string,
        meta: { className: "min-w-[120px]" },
      },
      {
        accessorKey: "comments",
        header: "Comments",
        cell: (info) => info.getValue() as string,
        meta: { className: "min-w-[100px] hidden md:table-cell" },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => info.getValue() as string,
        meta: { className: "min-w-[150px] hidden lg:table-cell" },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(row.original)}
            >
              {" "}
              <Download className="h-4 w-4" /> Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(row.original)}
            >
              {" "}
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        ),
        meta: { className: "text-right" },
      },
    ],
    [onDownload, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[520px]">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="group/row">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      "bg-background group-hover/row:bg-muted whitespace-nowrap",
                      (header.column.columnDef.meta as any)?.className || ""
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
                <TableRow key={row.id} className="group/row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "bg-background group-hover/row:bg-muted whitespace-nowrap text-xs sm:text-sm",
                        (cell.column.columnDef.meta as any)?.className || ""
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No reports found.
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

// Administrators table ------------------------------------------------------
interface AdminsTableProps {
  data: AdminRow[];
  onEdit: (row: AdminRow) => void;
  onToggleActive?: (row: AdminRow) => void;
  className?: string;
}

export function AdminsTable({ data, onEdit, onToggleActive, className }: AdminsTableProps) {
  const columns = React.useMemo<ColumnDef<AdminRow>[]>(() => [
    { accessorKey: 'name', header: 'Name', cell: info => <span className='font-medium'>{info.getValue() as string}</span>, meta:{ className: 'min-w-[160px]' } },
    { accessorKey: 'email', header: 'Email', cell: info => <span className='font-mono text-xs sm:text-sm'>{info.getValue() as string}</span>, meta:{ className: 'min-w-[180px]' } },
    { accessorKey: 'role', header: 'Role', cell: info => info.getValue() as string, meta:{ className: 'hidden md:table-cell' } },
    { accessorKey: 'active', header: 'Status', cell: info => {
        const v = info.getValue() as boolean | undefined
        return v ? <span className='inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>Active</span> : <span className='inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700'>Inactive</span>
      }, meta:{ className: 'hidden lg:table-cell' } },
    { id: 'actions', header: '', cell: ({ row }) => (
        <div className='flex gap-2 justify-end'>
          <Button variant='outline' size='sm' onClick={()=> onEdit(row.original)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
          {onToggleActive && (
            <Button variant={(row.original.active ? 'destructive' : 'outline')} size='sm' onClick={()=> onToggleActive(row.original)}>
              {( row.original.active ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />) } {(row.original.active ? 'Disable' : 'Enable')}
            </Button>
          )}
        </div>
      ), meta:{ className: 'text-right' } }
  ], [onEdit, onToggleActive])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={cn('space-y-4', className)}>
      <div className='rounded-md border overflow-x-auto'>
        <Table className='min-w-[640px]'>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className='group/row'>
                {hg.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan} className={cn('bg-background group-hover/row:bg-muted whitespace-nowrap', (header.column.columnDef.meta as any)?.className || '')}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className='group/row'>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className={cn('bg-background group-hover/row:bg-muted whitespace-nowrap text-xs sm:text-sm', (cell.column.columnDef.meta as any)?.className || '')}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>No administrators found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
