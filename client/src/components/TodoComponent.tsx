import React, { useState } from "react";
import { TaskDataReceived } from "../interfaces/task";
import Pagination from "./shared/Pagination";
import TodoCard from "./TodoCard";
import { Filter } from "../interfaces/filter";
import taskService from "../services/task.service";
import { useQuery } from "@tanstack/react-query";
import { FunnelPlus } from "lucide-react";
import FilterSidebar from "./shared/FilterSidebar";

interface PageParams {
  pageSize: number;
  pageIndex: number;
  filter: Filter;
}

const TodoComponent = () => {
  const [filter, setFilter] = useState<Filter>({ status: [], priority: [] });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [pagination, setPagination] = useState<{
    pageSize: number;
    pageIndex: number;
  }>({
    pageSize: 5,
    pageIndex: 0,
  });

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", pagination, filter],
    queryFn: () =>
      taskService.getAllTasks({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        filter,
      }),
    staleTime: 1000 * 60 * 3, // 3 minute
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return <p>Error loading todos</p>;
  }

  if (!tasks || !tasks.data || tasks.data.length === 0) {
    return <p>No todos available</p>;
  }

  return (
    <>
      <FilterSidebar
        visible={isFilterOpen}
        closeSidebar={() => setIsFilterOpen(false)}
        filter={filter}
        setFilter={setFilter}
        tab="todos"
      />
      <div className="absolute -top-16 left-64 flex p-2">
        <FunnelPlus
          onClick={() => setIsFilterOpen(true)}
          className="cursor-pointer hover:text-neutral-600"
        />
      </div>
      <div className="flex flex-col gap-5">
        {tasks.data.map((todo, ind) => (
          <TodoCard tab="todos" todo={todo} key={ind} />
        ))}
        <Pagination
          setPagination={setPagination}
          pagination={pagination}
          totalPage={tasks.meta?.totalPage || 0}
        />
      </div>
    </>
  );
};

export default TodoComponent;
