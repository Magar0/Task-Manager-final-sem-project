import TodoCard from "../components/TodoCard";
import { useState } from "react";
import { FunnelPlus, Plus } from "lucide-react";
import Modal from "../components/ui/Modal";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import { Button } from "../styles/app.style";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import taskService from "../services/task.service";
import { Task, TaskPriority, TaskStatus } from "../interfaces/task";
import TodoComponent from "../components/TodoComponent";
import AssignedTodoComponent from "../components/AssignedTodoComponent";
import FilterSidebar from "../components/shared/FilterSidebar";
import { Filter } from "../interfaces/filter";

const Home = () => {
  const [tab, setTab] = useState<"todos" | "assigned">("todos");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error creating task");
    },
  });

  const handleSave = async ({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedToId,
  }: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    assignedToId: string;
  }) => {
    try {
      await createTodo.mutateAsync({
        title,
        description,
        dueDate,
        priority: priority as TaskPriority,
        status: status as TaskStatus,
        assignedToId,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data.message;
      toast.error(errorMessage ? errorMessage : "Error creating task");
      console.log(err);
    }
  };

  return (
    <section className="container mx-auto px-5 py-3">
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          isCreator
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button
            className={cn(
              "mb-5 border-b-2 border-transparent p-2 text-xl transition-all",
              {
                "border-gray-300": tab === "todos",
              },
            )}
            onClick={() => setTab("todos")}
          >
            All todos
          </button>
          <button
            className={cn(
              "mb-5 border-b-2 border-transparent p-2 text-xl transition-all",
              {
                "border-gray-300": tab === "assigned",
              },
            )}
            onClick={() => setTab("assigned")}
          >
            Assigned todos
          </button>
        </div>
        {tab !== "assigned" && (
          <Button
            variant="secondary"
            className="btn flex bg-green-400 text-white hover:bg-green-300"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus /> Add
          </Button>
        )}
      </div>
      <div className="relative flex flex-col gap-5">
        {tab === "todos" ? <TodoComponent /> : <AssignedTodoComponent />}
      </div>
    </section>
  );
};

export default Home;
