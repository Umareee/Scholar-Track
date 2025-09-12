"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, differenceInDays, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScholarshipApplication } from "@/lib/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";

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
