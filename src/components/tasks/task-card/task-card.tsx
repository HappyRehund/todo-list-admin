// src/components/tasks/task-card/task-card.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { completeTask, deleteTask } from "@/actions/tasks/task-action";
import { formatDate, getDeadlineStatus, isOverdue } from "@/lib/utils/task";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit,
  User,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { UpdateTaskDialogContent } from "../update-task-dialog/update-task-dialog";
import { useRouter } from "next/navigation";
import { UserRole } from "@/generated/prisma/enums";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface TaskCardClientProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: "pending" | "completed";
    deadline: Date | null;
    createdAt: Date;
    assignedTo: {
      id: string;
      name: string;
      email: string;
    };
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
  };
  currentUser: {
    id: string;
    role: "admin" | "user";
    name: string;
    email: string;
  };
  users: User[];
}

export function TaskCardClient({ task, currentUser, users }: TaskCardClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const router = useRouter();

  const deadlineStatus = getDeadlineStatus(task.deadline);
  const isTaskOverdue = isOverdue(task.deadline);
  
  const canComplete = task.status === "pending" && 
    (currentUser.role === "admin" || task.assignedTo.id === currentUser.id);
  const canEdit = currentUser.role === "admin";
  const canDelete = currentUser.role === "admin";

  const handleCompleteTask = async () => {
    setIsLoading(true);
    try {
      const result = await completeTask({ taskId: task.id });
      if (result.status === "ERR") {
        alert(result.message);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert(`Failed to complete task with error : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    setIsLoading(true);
    try {
      const result = await deleteTask(task.id);
      if (result.status === "ERR") {
        alert(result.message);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert(`Failed to delete task with error : ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeadlineBadgeVariant = () => {
    if (!task.deadline) return "secondary";
    if (task.status === "completed") return "default";
    
    switch (deadlineStatus) {
      case "overdue": return "destructive";
      case "today": return "destructive";
      case "tomorrow": return "default";
      default: return "secondary";
    }
  };

  const getDeadlineText = () => {
    if (!task.deadline) return "No deadline";
    if (task.status === "completed") return formatDate(task.deadline);
    
    switch (deadlineStatus) {
      case "overdue": return `Overdue - ${formatDate(task.deadline)}`;
      case "today": return `Due Today - ${formatDate(task.deadline)}`;
      case "tomorrow": return `Due Tomorrow - ${formatDate(task.deadline)}`;
      default: return formatDate(task.deadline);
    }
  };

  return (
    <>
      <Card className={`transition-all hover:shadow-md ${
        task.status === "completed" ? "opacity-75" : ""
      } ${isTaskOverdue && task.status === "pending" ? "border-red-200 bg-red-50/30" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-semibold text-lg ${
                  task.status === "completed" ? "line-through text-gray-500" : ""
                }`}>
                  {task.title}
                </h3>
                <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                  {task.status === "completed" ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {task.status}
                </Badge>
              </div>
              
              {task.description && (
                <p className={`text-gray-600 text-sm ${
                  task.status === "completed" ? "line-through" : ""
                }`}>
                  {task.description}
                </p>
              )}
            </div>

            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem 
                      onClick={handleDeleteTask}
                      className="text-red-600 focus:text-red-600"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Deadline */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Badge variant={getDeadlineBadgeVariant()} className="text-xs">
                {isTaskOverdue && task.status === "pending" && (
                  <AlertTriangle className="w-3 h-3 mr-1" />
                )}
                {getDeadlineText()}
              </Badge>
            </div>

            {/* Assigned User */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Assigned to: <span className="font-medium">{task.assignedTo.name}</span>
              </span>
            </div>

            {/* Created By (if admin view) */}
            {currentUser.role === "admin" && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Created by: <span className="font-medium">{task.createdBy.name}</span>
                </span>
              </div>
            )}
          </div>
        </CardContent>

        {canComplete && (
          <CardFooter className="pt-0">
            <Button 
              onClick={handleCompleteTask}
              disabled={isLoading}
              className="w-full"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isLoading ? "Completing..." : "Mark as Complete"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {showUpdateDialog && (
        <UpdateTaskDialogContent
          task={task}
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          users={users}
        />
      )}
    </>
  );
}