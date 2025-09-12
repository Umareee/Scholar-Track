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
import { Check, GripVertical, PlusCircle, ChevronDown } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";

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

const DocumentChecklist = ({ 
  application,
  onApplicationUpdate,
}: { 
  application: ScholarshipApplication,
  onApplicationUpdate: (app: ScholarshipApplication) => void;
}) => {
    const { documents, id } = application;
    const [newDocumentName, setNewDocumentName] = React.useState("");

    const handleDocumentCheck = (documentName: string, checked: boolean) => {
        const updatedDocuments = documents.map(doc => 
            doc.name === documentName ? { ...doc, checked } : doc
        );
        onApplicationUpdate({ ...application, documents: updatedDocuments });
    };

    const handleAddDocument = () => {
      if (newDocumentName.trim() !== "") {
        const updatedDocuments = [...documents, { name: newDocumentName.trim(), checked: false }];
        onApplicationUpdate({ ...application, documents: updatedDocuments });
        setNewDocumentName("");
      }
    };
    
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
          <PopoverContent className="w-64 p-2" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              <p className="text-sm font-medium">Documents</p>
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${id}-${doc.name}-${index}`} 
                    checked={doc.checked}
                    onCheckedChange={(checked) => handleDocumentCheck(doc.name, !!checked)}
                  />
                  <label
                    htmlFor={`${id}-${doc.name}-${index}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {doc.name}
                  </label>
                </div>
              ))}
            </div>
             <div className="flex items-center space-x-2 mt-4">
              <Input
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                placeholder="Add new document"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDocument();
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddDocument} className="h-9 w-9">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

export const columns = ({ onEdit, onDelete, onApplicationUpdate }: { onEdit: (app: ScholarshipApplication) => void; onDelete: (id: string) => void; onApplicationUpdate: (app: ScholarshipApplication) => void; }): ColumnDef<ScholarshipApplication>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
            variant="ghost"
            size="icon"
            onClick={row.getToggleExpandedHandler()}
            disabled={!row.getCanExpand()}
            className="h-8 w-8"
        >
            <ChevronDown
            className={cn(
                'h-4 w-4 transition-transform',
                row.getIsExpanded() && 'rotate-180'
            )}
            />
        </Button>
      )
    },
  },
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
    cell: ({ row }) => <DocumentChecklist application={row.original} onApplicationUpdate={onApplicationUpdate} />,
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
