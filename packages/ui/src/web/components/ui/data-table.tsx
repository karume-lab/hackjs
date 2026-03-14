"use client"


import { useEffect, useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LayoutGrid, List, Search, X } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/web/components/ui/table"
import { Button } from "@repo/ui/web/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/web/components/ui/select"
import { Input } from "@repo/ui/web/components/ui/input"

interface FilterOption {
  label: string
  value: string
}

interface FilterConfig<V extends string = string> {
  name: string
  options: FilterOption[]
  value?: V
  onValueChange?: (value: V) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  searchKey?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filterConfigs?: FilterConfig[]
  viewMode?: "table" | "grid"
  onViewModeChange?: (view: "table" | "grid") => void
  renderCard?: (item: TData) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  searchKey,
  searchValue,
  onSearchChange,
  filterConfigs,
  viewMode = "table",
  onViewModeChange,
  renderCard,
}: DataTableProps<TData, TValue>) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || "")

  useEffect(() => {
    setLocalSearchValue(searchValue || "")
  }, [searchValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchValue !== (searchValue || "")) {
        onSearchChange?.(localSearchValue)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localSearchValue, onSearchChange, searchValue])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {searchKey && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder={`Search ${searchKey}...`}
                value={localSearchValue}
                onChange={(event) => setLocalSearchValue(event.target.value)}
                className="pl-9 pr-8"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-0 top-0 h-8 w-8 px-0 hover:bg-transparent"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          )}
          {filterConfigs?.map((config) => (
            <Select
              key={config.name}
              value={config.value || "all"}
              onValueChange={(value) => config.onValueChange?.(value)}
            >
              <SelectTrigger className="h-8 min-w-32 capitalize">
                <SelectValue placeholder={`Filter by ${config.name}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {config.name}</SelectItem>
                {config.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {onViewModeChange && (
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-950">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="h-7 w-7 p-0"
              title="Table View"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-7 w-7 p-0"
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {viewMode === "table" ? (
        <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
          <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="contents">
                {renderCard ? renderCard(item) : (
                  <div className="p-4 border rounded-lg">
                    {/* Fallback card content */}
                    {Object.values(item as any).map((val: any, i) => (
                      <div key={i} className="truncate text-sm">{String(val)}</div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg text-zinc-500">
              No results found.
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-zinc-500">
          Showing {table.getRowModel().rows.length} records.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-25 items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
