import React, { useState } from "react";
import { cn } from "../../lib/utils";
import Select from "react-select";
import { Button } from "../../styles/app.style";
import { TaskPriority, TaskStatus } from "../../interfaces/task";
import { Filter } from "../../interfaces/filter";

interface Props {
  visible?: boolean;
  closeSidebar: () => void;
  filter?: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  tab?: "todos" | "assigned";
}

interface selectOptions {
  value: string;
  label: string;
}
interface FormData {
  status: selectOptions[];
  priority: selectOptions[];
  // creator: selectOptions[];
  // assignee: selectOptions[];
  // dueDate?: string;
}

const FilterSidebar = ({ visible, closeSidebar, filter, setFilter }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    status: statusOptions.filter((option) =>
      filter?.status?.includes(option.value as TaskStatus),
    ),
    priority: priorityOptions.filter((option) =>
      filter?.priority?.includes(option.value as TaskPriority),
    ),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilter({
      status: formData.status.map((option) => option.value as TaskStatus),
      priority: formData.priority.map((option) => option.value as TaskPriority),
    });
    closeSidebar();
  };
  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen w-screen bg-black/30",
          visible && "block",
        )}
        onClick={closeSidebar}
      ></div>

      <div
        className={cn(
          "fixed right-0 top-0 z-[500] h-screen w-80 bg-neutral-100 transition-transform duration-300",
          visible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col gap-5 p-4">
          <p className="w-full border-b-2 text-2xl font-bold text-neutral-700 shadow-sm">
            Filter
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="">
              <label>Select status</label>
              <Select
                value={formData.status}
                onChange={(selectedOptions) => {
                  setFormData((prev) => ({
                    ...prev,
                    status: selectedOptions as selectOptions[],
                  }));
                }}
                options={statusOptions}
                isMulti
                placeholder="Select status"
              />
            </div>
            <div className="">
              <label>Select priority</label>
              <Select
                value={formData.priority}
                onChange={(selectedOptions) => {
                  setFormData((prev) => ({
                    ...prev,
                    priority: selectedOptions as selectOptions[],
                  }));
                }}
                options={priorityOptions}
                isMulti
                placeholder="Select priority"
              />
            </div>
            <Button type="submit" variant="primary" className="w-fit">
              Done
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

const statusOptions = [
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in_progress",
    label: "In progress",
  },
  {
    value: "done",
    label: "Done",
  },
];

const priorityOptions = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "high",
    label: "High",
  },
];
