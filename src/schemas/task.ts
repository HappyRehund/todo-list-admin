//src/schemas/task.ts
import z from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    description: z.string().optional(),
    assignedToId: z.uuid("Invalid User ID"),
    deadline: z.iso.datetime().optional()
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters").optional(),
    description: z.string().optional(),
    assignedToId: z.uuid("Assigned user ID must be a valid UUID").optional(),
    deadline: z.iso.datetime().optional(),
})

export const completeTaskSchema = z.object({
    taskId: z.uuid("Invalid User ID"),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;