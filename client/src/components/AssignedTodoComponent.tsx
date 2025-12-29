import React, { useEffect, useState } from "react";
import { TaskDataReceived } from "../interfaces/task";
import Pagination from "./shared/Pagination";
import TodoCard from "./TodoCard";
import { Filter } from "../interfaces/filter";
import taskService from "../services/task.service";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FunnelPlus } from "lucide-react";
import FilterSidebar from "./shared/FilterSidebar";

interface PageParams {
  pageSize: number;
  pageIndex: number;
  filter: Filter;
}

const AssignedTodoComponent = () => {
  const [filter, setFilter] = useState<Filter>({ status: [], priority: [] });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const [pagination, setPagination] = useState<{
    pageSize: number;
    pageIndex: number;
  }>({
    pageSize: 5, // Number of tasks per page
    pageIndex: 0,
  });

  const {
    data: tasks,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["todos", "assignedTodos", pagination, filter],
    queryFn: ({ pageParam = 0 }) =>
      taskService.getAssignedTasks({
        limit: pagination.pageSize,
        offset: pageParam * pagination.pageSize,
        filter,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (
        lastPage.meta?.totalPage &&
        allPages.length < lastPage.meta.totalPage
      ) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3, // 3 minute
  });

  // Intersection Observer to load more tasks when scrolled to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

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
        {/* Empty state */}
        {!isFetching && tasks?.pages.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            {`No tasks found. ${filter.status?.length || filter.priority?.length ? "Try adjusting your filters." : "You can create a new task."}`}
          </div>
        )}

        {/* displaying pendng,error or the data */}
        {status === "pending" ? (
          <div className="flex h-full items-center justify-center">
            <div className="loader"></div>
          </div>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          tasks?.pages.map((page) =>
            page.data.map((task) => (
              <TodoCard key={task.id} todo={task} tab="assigned" />
            )),
          )
        )}
        {/* on end reached*/}
        {!hasNextPage && tasks?.pages && tasks.pages.length > 0 && (
          <div className="mt-2 py-4 text-center text-gray-500">
            You've reached the end.
          </div>
        )}

        {isFetchingNextPage && (
          <div className="mt-2 flex w-full justify-center">
            <div className="loader"></div>
          </div>
        )}
        {/* Sentinel element for infinite scroll */}
        <div ref={loadMoreRef} aria-hidden="true" className="mt-10 h-1" />
      </div>
    </>
  );
};

export default AssignedTodoComponent;
