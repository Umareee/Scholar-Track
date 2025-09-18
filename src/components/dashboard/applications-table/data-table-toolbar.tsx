"use client";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAddNew: () => void;
}

export function DataTableToolbar<TData>({
  table,
  onAddNew,
}: DataTableToolbarProps<TData>) {

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
      </div>
       <Button onClick={onAddNew} size="sm" className="h-9">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Application
      </Button>
    </div>
  );
}
