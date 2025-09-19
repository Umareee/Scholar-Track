"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ALL_STATUSES, DOCUMENT_CHECKLIST_ITEMS, ScholarshipApplication, ALL_PRIORITIES } from "@/lib/types";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

const documentSchema = z.object({
    name: z.string().min(1, "Document name cannot be empty."),
    checked: z.boolean(),
});

const formSchema = z.object({
  scholarshipName: z.string().min(2, "Scholarship name is required."),
  university: z.string().min(2, "University name is required."),
  country: z.string().min(2, "Country is required."),
  deadline: z.date({ required_error: "A deadline date is required." }),
  status: z.enum(ALL_STATUSES),
  priority: z.enum(ALL_PRIORITIES),
  link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  documents: z.array(documentSchema),
  notes: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof formSchema>;

interface ApplicationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (application: ScholarshipApplication) => void;
  application: ScholarshipApplication | null;
}

export function ApplicationDialog({
  isOpen,
  onOpenChange,
  onSave,
  application,
}: ApplicationDialogProps) {
  const [newDocumentName, setNewDocumentName] = useState("");

  const defaultValues: Partial<ApplicationFormValues> = application
    ? {
        ...application,
        deadline: new Date(application.deadline),
      }
    : {
        scholarshipName: "",
        university: "",
        country: "",
        status: "Not Started",
        priority: "None",
        link: "",
        documents: DOCUMENT_CHECKLIST_ITEMS.map(name => ({ name, checked: false })),
        notes: "",
      };

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents"
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [application, isOpen, form]);

  function onSubmit(values: ApplicationFormValues) {
    const newOrUpdatedApplication: ScholarshipApplication = {
      id: application?.id || crypto.randomUUID(),
      ...values,
      deadline: values.deadline.toISOString(),
      link: values.link || "",
      notes: values.notes || "",
    };
    onSave(newOrUpdatedApplication);
    onOpenChange(false);
  }

  const handleAddDocument = () => {
    if (newDocumentName.trim() !== "") {
      append({ name: newDocumentName.trim(), checked: false });
      setNewDocumentName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] grid-rows-[auto_1fr_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
          <DialogDescription>
            Fill in the details of the scholarship application below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="scholarshipName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scholarship Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rhodes Scholarship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. University of Oxford" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. United Kingdom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/scholarship" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-1.5">Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALL_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_PRIORITIES.map(priority => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormItem>
                <FormLabel>Documents Checklist</FormLabel>
                <div className="space-y-2">
                  {fields.map((item, index) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`documents.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3">
                          <Checkbox
                            checked={field.value.checked}
                            onCheckedChange={(checked) => {
                              field.onChange({ ...field.value, checked: !!checked });
                            }}
                          />
                          <FormControl>
                            <Input {...field} value={field.value.name} onChange={(e) => field.onChange({...field.value, name: e.target.value})} />
                          </FormControl>
                           <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                        </FormItem>
                      )}
                    />
                  ))}
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newDocumentName}
                      onChange={(e) => setNewDocumentName(e.target.value)}
                      placeholder="Add new document"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDocument();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddDocument}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant notes here..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Application</Button>
            </DialogFooter>
          </form>
        </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
