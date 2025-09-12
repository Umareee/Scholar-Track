"use client";

import * as React from "react";
import {
  Award,
  BookMarked,
  ListTodo,
  Loader2,
  PlusCircle,
  Send,
  XCircle,
} from "lucide-react";
import { ApplicationStatus, ScholarshipApplication } from "@/lib/types";
import { initialApplications } from "@/lib/data";
import { Button } from "@/components/ui/button";
import StatusCard from "@/components/dashboard/status-card";
import { ApplicationDialog } from "@/components/dashboard/application-dialog";
import { DataTable } from "@/components/dashboard/applications-table/data-table";
import { columns } from "@/components/dashboard/applications-table/columns";

export default function Home() {
  const [applications, setApplications] =
    React.useState<ScholarshipApplication[]>(initialApplications);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingApplication, setEditingApplication] =
    React.useState<ScholarshipApplication | null>(null);

  const statusCounts = React.useMemo(() => {
    return applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);
  }, [applications]);

  const handleAddNew = () => {
    setEditingApplication(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (app: ScholarshipApplication) => {
    setEditingApplication(app);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleSave = (appData: ScholarshipApplication) => {
    if (editingApplication) {
      setApplications((prev) =>
        prev.map((app) => (app.id === appData.id ? appData : app))
      );
    } else {
      setApplications((prev) => [...prev, appData]);
    }
    setEditingApplication(null);
  };

  const statusCards = [
    {
      title: "Not Started",
      count: statusCounts["Not Started"] || 0,
      icon: <ListTodo className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "In Progress",
      count: statusCounts["In Progress"] || 0,
      icon: <Loader2 className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Submitted",
      count: statusCounts["Submitted"] || 0,
      icon: <Send className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Accepted",
      count: statusCounts["Accepted"] || 0,
      icon: <Award className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Rejected",
      count: statusCounts["Rejected"] || 0,
      icon: <XCircle className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">ScholarTrack</h1>
        </div>
        <div className="ml-auto">
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statusCards.map((card) => (
            <StatusCard
              key={card.title}
              title={card.title}
              count={card.count}
              icon={card.icon}
            />
          ))}
        </div>
        <div className="rounded-lg border shadow-sm">
          <DataTable
            columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
            data={applications}
          />
        </div>
      </main>

      <ApplicationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
        application={editingApplication}
      />
    </div>
  );
}
