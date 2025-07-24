import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyTasks } from "../data/task/get-all-spesific-id-task";
import { getAllTasks } from "../data/task/get-all-tasks";
import { getCurrentUser } from "../data/user/auth";
import { TaskCardWrapper } from "@/components/tasks/task-card/task-card-wrappet";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog/create-task-wrapper";


export default async function TasksPage() {
  const user = await getCurrentUser({ redirectIfNotFound: true, withFullUser:true });

  const tasksResult =
    user.role === "admin" ? await getAllTasks() : await getMyTasks();

  if (!tasksResult.success) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{tasksResult.error}</p>
        </div>
      </div>
    );
  }

  const tasks = tasksResult.data;

  const pendingTasks = tasks?.filter((task) => task.status === "pending");
  const completedTasks = tasks?.filter((task) => task.status === "completed");

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {user.role === "admin" ? "All Tasks" : "My Tasks"}
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === "admin"
              ? "Manage all tasks in the system"
              : "View and complete your assigned tasks"}
          </p>
        </div>

        {user.role === "admin" && (
          <CreateTaskDialog>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </CreateTaskDialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="text-2xl font-bold text-gray-900">
            {tasks?.length ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold text-orange-600">
            {pendingTasks?.length ?? 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">
            {completedTasks?.length ?? 0}
          </p>
        </div>
      </div>
      {/* Task Lists */}
      <div className="space-y-8">
        {/* Pending Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            Pending Tasks ({pendingTasks?.length ?? 0})
          </h2>

          {(pendingTasks?.length ?? 0) === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No pending tasks</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingTasks?.map((task) => (
                <TaskCardWrapper key={task.id} task={task} currentUser={user} />
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Completed Tasks ({completedTasks?.length ?? 0})
          </h2>

          {(completedTasks?.length ?? 0) === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No completed tasks</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {completedTasks?.map((task) => (
                <TaskCardWrapper key={task.id} task={task} currentUser={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
