"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, differenceInDays, isPast } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScholarshipApplication, ALL_STATUSES, Priority, ALL_PRIORITIES } from "@/lib/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, PlusCircle, Notebook, Flag, Dot, ExternalLink } from "lucide-react";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DeadlineDisplay = ({ deadline }: { deadline: string }) => {
  // Handle empty deadline
  if (!deadline || deadline === '') {
    return <span className="text-muted-foreground">No deadline set</span>;
  }

  const deadlineDate = new Date(deadline);
  
  // Check if date is invalid
  if (isNaN(deadlineDate.getTime())) {
    return <span className="text-muted-foreground">Invalid date</span>;
  }

  const now = new Date();
  const daysRemaining = differenceInDays(deadlineDate, now);

  if (isPast(deadlineDate) && daysRemaining < 0) {
    return <span className="text-destructive font-medium">Overdue ({format(deadlineDate, "PPP")})</span>;
  }
  
  let colorClass = "";
  if (daysRemaining < 7) {
    colorClass = "text-destructive font-medium";
  } else if (daysRemaining < 30) {
    colorClass = "text-yellow-600 dark:text-yellow-500 font-medium";
  }

  return (
    <div className="flex flex-col">
      <span className={colorClass}>{format(deadlineDate, "PPP")}</span>
      <span className="text-sm text-muted-foreground">
        {daysRemaining >= 0 ? `${daysRemaining} days left` : ''}
      </span>
    </div>
  );
};

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Accepted": "default",
  "Submitted": "secondary",
  "In Progress": "outline",
  "Not Started": "outline",
  "Rejected": "destructive",
};

const priorityColorMap: Record<Priority, string> = {
    High: "text-red-500",
    Medium: "text-yellow-500",
    Low: "text-green-500",
    None: "text-gray-500"
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
            <Button variant="outline" size="sm" className="h-8" onClick={(e) => e.stopPropagation()}>
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
            onClick={(e) => { e.stopPropagation(); row.toggleExpanded();}}
            disabled={!row.getCanExpand()}
            className="h-8 w-8"
        >
            <Notebook className="h-4 w-4 text-muted-foreground" />
        </Button>
      )
    },
    size: 40,
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
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const { link } = row.original;
      if (!link) return null;
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline" onClick={(e) => e.stopPropagation()}>
          <ExternalLink className="h-4 w-4" />
          <span>Visit</span>
        </a>
      );
    }
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
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const application = row.original;
      const Icon = application.priority === 'None' ? Dot : Flag;
      return (
        <Select
          value={application.priority}
          onValueChange={(priority) =>
            onApplicationUpdate({ ...application, priority: priority as Priority })
          }
        >
          <SelectTrigger className="w-32 h-8 text-xs px-2 py-1">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", priorityColorMap[application.priority])} />
                {application.priority}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ALL_PRIORITIES.map((priority) => {
              const ItemIcon = priority === 'None' ? Dot : Flag;
              return (
              <SelectItem key={priority} value={priority}>
                <div className="flex items-center gap-2">
                  <ItemIcon className={cn("h-4 w-4", priorityColorMap[priority])} />
                  {priority}
                </div>
              </SelectItem>
            )})}
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const application = row.original;
        return (
          <Select 
            value={application.status} 
            onValueChange={(status) => onApplicationUpdate({ ...application, status: status as any })}
          >
            <SelectTrigger className="w-36 h-8 text-xs px-2 py-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  <Badge 
                    variant={statusVariantMap[status] || "outline"} 
                    className={cn("text-xs", status === 'Accepted' && 'bg-green-600 text-white')}
                  >
                    {status}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
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
