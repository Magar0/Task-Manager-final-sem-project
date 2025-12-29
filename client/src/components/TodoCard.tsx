import { FilePenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import toast from "react-hot-toast";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { cn } from "../lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import taskService from "../services/task.service";
import userService from "../services/user.service";
import { Task, TaskStatus } from "../interfaces/task";
import DialogueBox from "./ui/DialogueBox";

interface Props {
  todo: Task;
  tab: "todos" | "assigned";
}
const TodoCard = ({ todo, tab }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);

  const currentUser = useSelector((state: RootState) => state.users.user);
  const sidebar = useSelector((state: RootState) => state.sidebar);

  const queryClient = useQueryClient();

  const { data: allUsers } = useQuery<{ id: string; username: string }[]>({
    queryKey: ["users"],
    queryFn: userService.fetchAllUsers,
    select: (data) =>
      data.map((user) => ({
        id: user.id,
        username: user.username,
      })),
    refetchOnWindowFocus: false,
  });
  const deleteTask = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error deleting task");
      console.error("Error deleting task:", error);
    },
  });
  const mutateTask = useMutation({
    mutationFn: (data) => taskService.updateTask(todo.id, data),
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error updating task");
      console.error("Error updating task:", error);
    },
  });

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={mutateTask.mutateAsync}
          isCreator={todo.createdById === currentUser?.userId}
          initialData={todo}
        />
      )}
      <DialogueBox
        isOpen={isDialogueOpen}
        onClose={() => setIsDialogueOpen(false)}
        onConfirm={() => deleteTask.mutateAsync(todo.id)}
        title="Are you sure you want to delete this task?"
      />
      <div
        className={cn("relative z-10 h-28 w-full rounded-md bg-blue-50 p-4", {
          "bg-yellow-200": todo.status === TaskStatus.IN_PROGRESS,
          "bg-green-200": todo.status === TaskStatus.DONE,
          "-z-10": sidebar,
        })}
      >
        <div className="flex items-center justify-between">
          <h5 className="text-xl">{todo.title}</h5>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-neutral-700">
              Priority :{" "}
              <span className="text-xs italic text-neutral-500">
                {todo.priority}
              </span>
            </div>
            <div className="text-sm font-medium text-neutral-700">
              Status :{" "}
              <span className="text-xs italic text-neutral-500">
                {todo.status}
              </span>
            </div>
            <FilePenLine
              className="cursor-pointer text-neutral-500"
              onClick={() => setIsModalOpen(true)}
            />
            <Trash2
              className="cursor-pointer text-red-400"
              onClick={() => setIsDialogueOpen(true)}
            />
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-700">
          {todo.description}
        </p>
        <div className="absolute bottom-2 left-0 flex w-full items-center justify-between px-5 text-xs italic text-neutral-500">
          <div className="flex gap-3">
            {tab === "assigned" && (
              <p>
                Created By:{" "}
                {
                  allUsers?.find((user) => user.id === todo.createdById)
                    ?.username
                }
              </p>
            )}
            <p>
              {todo.assignedToId
                ? `Assigned to: ${allUsers?.find((user) => user.id === todo.assignedToId)?.username}`
                : ""}
            </p>
          </div>
          <p>Update at: {new Date(todo.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

export default TodoCard;
