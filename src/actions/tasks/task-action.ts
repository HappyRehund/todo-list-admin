//src/actions/tasks/task-action.ts
"use server";
import { getCurrentUser } from "@/app/data/user/auth";
import { prisma } from "@/lib/client/prisma";
import {
  CreateTaskInput,
  createTaskSchema,
  UpdateTaskInput,
  updateTaskSchema,
  CompleteTaskInput,
  completeTaskSchema,
} from "@/schemas/task";
import { revalidatePath } from "next/cache";

interface CreatePostResponse {
  status: "OK" | "ERR";
  message: string;
}

export async function createTask(
  unsafeData: CreateTaskInput
): Promise<CreatePostResponse> {
  try {
    const user = await getCurrentUser({ redirectIfNotFound: true });

    if (user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create tasks");
    }

    const { success, data } = createTaskSchema.safeParse(unsafeData);

    if (!success) {
      return { status: "ERR", message: "Invalid task data" };
    }

    await prisma.$transaction(async (tx) => {
      //cari user
      await tx.user.findUnique({
        where: {
          id: data.assignedToId,
        },
        select: {
          id: true,
          name: true,
        },
      });
      //assign ke user
      await tx.task.create({
        data: {
          title: data.title,
          description: data.description,
          assignedToId: data.assignedToId,
          createdById: user.id,
          deadline: data.deadline ? new Date(data.deadline) : null,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    revalidatePath("/tasks");
    return { status: "OK", message: "Task created successfully" };
  } catch (error) {
    console.error("Error creating task:", error);
    return { status: "ERR", message: "Failed to create task" };
  }
}

export async function updateTask(
  taskId: string,
  unsafeData: UpdateTaskInput
): Promise<CreatePostResponse> {
  try {
    const user = await getCurrentUser({ redirectIfNotFound: true });

    if (user.role !== "admin") {
      throw new Error("Unauthorized: Only admins can create tasks");
    }

    const { success, data } = updateTaskSchema.safeParse(unsafeData);
    if (!success) {
      return {
        status: "ERR",
        message: "Invalid task data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const existingTask = await tx.task.findUnique({
        where: { id: taskId },
      });

      if (!existingTask) {
        return {
          status: "ERR",
          message: "Task not found",
        };
      }

      if (data.assignedToId) {
        const assignedUser = await tx.user.findUnique({
          where: {
            id: data.assignedToId,
          },
          select: {
            id: true,
          },
        });
        if (!assignedUser) {
          return {
            status: "ERR",
            message: "User not found",
          };
        }
      }

      await tx.task.update({
        where: { id: taskId },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.assignedToId && { assignedToId: data.assignedToId }),
          ...(data.deadline && { deadline: data.deadline }),
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    revalidatePath("/tasks");
    return {
      status: "OK",
      message: "Berhasil Update",
    };
  } catch (error) {
    console.error("Error updating task", error);
    return {
      status: "ERR",
      message: "Failed updating task",
    };
  }
}

export async function completeTask(
  unsafeData: CompleteTaskInput
): Promise<CreatePostResponse> {
  try {
    const user = await getCurrentUser({ redirectIfNotFound: true });

    const { success, data } = completeTaskSchema.safeParse(unsafeData);

    if (!success) {
      return {
        status: "ERR",
        message: "Input Data not valid",
      };
    }

    await prisma.$transaction(async (tx) => {
      // cari task unique
      const task = await tx.task.findUnique({
        where: { id: data.taskId },
        select: { id: true, assignedToId: true, status: true },
      });

      // guard clause
      if (!task) {
        return { status: "ERR", message: "Task with this Id not found" };
      }

      if (user.role !== "admin" && task.assignedToId !== user.id) {
        return { status: "ERR", message: "Unauthorized" };
      }

      if (task.status === "completed") {
        return { status: "ERR", message: "Task already done before" };
      }

      await tx.task.update({
        where: {
          id: data.taskId,
        },
        data: {
          status: "completed",
        },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    revalidatePath("/tasks");
    return {
      status: "OK",
      message: "Selamat!! Tugas selesai",
    };
  } catch (error) {
    console.error("Error completing task:", error);
    return {
      status: "ERR",
      message: "Something went wrong, can't complete the task",
    };
  }
}

//delete task
export async function deleteTask(taskId: string): Promise<CreatePostResponse> {
  try {
    await getCurrentUser({ redirectIfNotFound: true });
    await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          id: true,
        },
      });

      if (!task) {
        return {
          status: "ERR",
          message: "Task not found",
        };
      }

      await tx.task.delete({
        where: {
          id: taskId,
        },
      });
    });

    revalidatePath("/tasks");
    return {
      status: "OK",
      message: "Succes deleted the task",
    };
  } catch (error) {
    console.error("Error deleting task: ", error);
    return {
      status: "ERR",
      message: "Something went wrong",
    };
  }
}


