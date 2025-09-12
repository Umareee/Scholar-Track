"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { ALL_STATUSES } from "@/lib/types";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Award, ListTodo, Loader2, Send, XCircle } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const statusIcons = [
    { value: 'Not Started', label: 'Not Started', icon: ListTodo },
    { value: 'In Progress', label: 'In Progress', icon: Loader2 },
    { value: 'Submitted', label: 'Submitted', icon: Send },
    { value: 'Accepted', label: 'Accepted', icon: Award },
    { value: 'Rejected', label: 'Rejected', icon: XCircle },
]

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search scholarships..."
          value={
            (table.getColumn("scholarshipName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("scholarshipName")?.setFilterValue(event.target.value)
          }
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusIcons}
          />
        )}
      </div>
    </div>
  );
}
