"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, differenceInDays, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScholarshipApplication, Document } from "@/lib/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, GripVertical } from "lucide-react";

const DeadlineDisplay = ({ deadline }: { deadline: string }) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysRemaining = differenceInDays(deadlineDate, now);

  if (isPast(deadlineDate)) {
    return <span className="text-destructive font-medium">Overdue</span>;
  }
  if (daysRemaining < 7) {
    return <span className="text-destructive font-medium">{format(deadlineDate, "PPP")}</span>;
  }
  if (daysRemaining < 30) {
    return <span className="text-yellow-600 dark:text-yellow-500 font-medium">{format(deadlineDate, "PPP")}</span>;
  }
  return <span>{format(deadlineDate, "PPP")}</span>;
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Accepted": "default",
  "Submitted": "secondary",
  "In Progress": "outline",
  "Not Started": "outline",
  "Rejected": "destructive",
};

const DocumentChecklist = ({ documents }: { documents: Document[] }) => {
    const checkedCount = documents.filter((doc) => doc.checked).length;
    const totalCount = documents.length;
  
    return (
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <GripVertical className="mr-2 h-4 w-4" />
              <span>{`${checkedCount}/${totalCount}`}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Documents</p>
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${doc.name}-${index}`} checked={doc.checked} disabled />
                  <label
                    htmlFor={`${doc.name}-${index}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {doc.name}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground text-sm">{`${checkedCount}/${totalCount}`}</span>
      </div>
    );
  };

export const columns = ({ onEdit, onDelete }: { onEdit: (app: ScholarshipApplication) => void; onDelete: (id: string) => void }): ColumnDef<ScholarshipApplication>[] => [
  {
    accessorKey: "scholarshipName",
    header: "Scholarship",
    cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-medium truncate">{row.original.scholarshipName}</span>
            <span className="text-sm text-muted-foreground">{row.original.university}</span>
        </div>
    )
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => <DeadlineDisplay deadline={row.original.deadline} />,
  },
  {
    accessorKey: "documents",
    header: "Documents",
    cell: ({ row }) => <DocumentChecklist documents={row.original.documents} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        const variant = statusVariantMap[status] || "outline";
        return <Badge variant={variant} className={cn(status === 'Accepted' && 'bg-green-600 text-white')}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
