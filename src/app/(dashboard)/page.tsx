
"use client";

import * as React from "react";
import {
  Award,
  BookMarked,
  ListTodo,
  Loader2,
  LogOut,
  Send,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { ApplicationStatus, ScholarshipApplication, Priority } from "@/lib/types";
import StatusCard from "@/components/dashboard/status-card";
import { ApplicationDialog } from "@/components/dashboard/application-dialog";
import { DataTable } from "@/components/dashboard/applications-table/data-table";
import { columns } from "@/components/dashboard/applications-table/columns";
import { differenceInDays, isPast } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = React.useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingApplication, setEditingApplication] = React.useState<ScholarshipApplication | null>(null);

  React.useEffect(() => {
    if (user) {
      const fetchApplications = async () => {
        const { data, error } = await supabase
          .from('user_applications')
          .select('applications')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setApplications(data.applications || []);
        }
        setLoading(false);
      };
      fetchApplications();
    }
  }, [user]);

  const updateSupabase = async (updatedApplications: ScholarshipApplication[]) => {
    if (user) {
      await supabase
        .from('user_applications')
        .update({ applications: updatedApplications })
        .eq('user_id', user.id);
    }
  };

  const sortedApplications = React.useMemo(() => {
    const priorityOrder: Record<Priority, number> = { High: 1, Medium: 2, Low: 3, None: 4 };
    
    return [...applications].sort((a, b) => {
      const aIsOverdue = isPast(new Date(a.deadline)) && differenceInDays(new Date(a.deadline), new Date()) < 0;
      const bIsOverdue = isPast(new Date(b.deadline)) && differenceInDays(new Date(b.deadline), new Date()) < 0;

      if (aIsOverdue && !bIsOverdue) return 1;
      if (!aIsOverdue && bIsOverdue) return -1;
      
      const priorityA = priorityOrder[a.priority] || 5;
      const priorityB = priorityOrder[b.priority] || 5;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [applications]);

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
    const updatedApplications = applications.filter((app) => app.id !== id);
    setApplications(updatedApplications);
    updateSupabase(updatedApplications);
  };

  const handleSave = (appData: ScholarshipApplication) => {
    let updatedApplications;
    if (editingApplication || applications.find(a => a.id === appData.id)) {
      updatedApplications = applications.map((app) => (app.id === appData.id ? appData : app));
    } else {
      updatedApplications = [...applications, appData];
    }
    setApplications(updatedApplications);
    updateSupabase(updatedApplications);
    setEditingApplication(null);
  };
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statusCards = [
    { title: "Not Started", count: statusCounts["Not Started"] || 0, icon: <ListTodo className="h-6 w-6 text-muted-foreground" /> },
    { title: "In Progress", count: statusCounts["In Progress"] || 0, icon: <Loader2 className="h-6 w-6 text-muted-foreground" /> },
    { title: "Submitted", count: statusCounts["Submitted"] || 0, icon: <Send className="h-6 w-6 text-muted-foreground" /> },
    { title: "Accepted", count: statusCounts["Accepted"] || 0, icon: <Award className="h-6 w-6 text-muted-foreground" /> },
    { title: "Rejected", count: statusCounts["Rejected"] || 0, icon: <XCircle className="h-6 w-6 text-muted-foreground" /> },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <BookMarked className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">ScholarTrack</h1>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user?.user_metadata?.avatar_url || undefined} alt={user?.user_metadata?.full_name || "User"} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statusCards.map((card) => (
            <StatusCard key={card.title} title={card.title} count={card.count} icon={card.icon} />
          ))}
        </div>
        <div className="rounded-lg border shadow-sm bg-card">
          <DataTable
            columns={columns({ onEdit: handleEdit, onDelete: handleDelete, onApplicationUpdate: handleSave })}
            data={sortedApplications}
            onAddNew={handleAddNew}
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
