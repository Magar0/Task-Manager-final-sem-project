import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../../styles/app.style";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { get } from "http";

interface PaginationProps {
  setPagination: React.Dispatch<
    React.SetStateAction<{ pageSize: number; pageIndex: number }>
  >;
  pagination: { pageSize: number; pageIndex: number };
  totalPage: number;
}

const Pagination = ({
  setPagination,
  pagination,
  totalPage,
}: PaginationProps) => {
  const pageIndex = pagination.pageIndex;
  const getPageNumbers = () => {
    if (!totalPage) return [];
    if (totalPage === 1) return [0]; // Only one page, show [0]
    if (totalPage === 2) return [0, 1]; // Only two pages, show both [0, 1]
    const pages = [];
    const maxPagesToShow = 3; // Number of page numbers to show
    const startPage = Math.max(
      0,
      pagination.pageIndex - Math.floor(maxPagesToShow / 2),
    );
    const endPage = Math.min(
      totalPage - 1,
      pageIndex === 0
        ? startPage + maxPagesToShow - 2
        : startPage + maxPagesToShow - 1,
    );
    if (startPage > 0) pages.push(0);
    if (startPage > 1) pages.push("...");
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPage - 2) pages.push("...");
    if (endPage < totalPage - 1) pages.push(totalPage - 1);
    console.log({ startPage, endPage, pages });
    return pages;
  };

  console.log({ page: getPageNumbers(), totalPage, pageIndex });

  return (
    <div className="flex flex-col items-start justify-between px-2 pb-4 pt-3 sm:flex-row sm:items-center">
      <div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          {/* no of item per page */}
          <p className="text-sm font-normal">No of items</p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              setPagination({ pageSize: Number(value), pageIndex: 0 });
            }}
          >
            <SelectTrigger className="h-8 w-fit gap-2">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[3, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          {/* btn to go prev or first page */}
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPagination((pre) => ({ ...pre, pageIndex: 0 }));
            }}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPagination((pre) => ({
                ...pre,
                pageIndex: pre.pageIndex - 1,
              }));
            }}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <>
              {page === "..." ? (
                <span key={index} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={pageIndex === page ? "primary" : "outline"}
                  className={cn("h-8 w-8 p-0", {
                    "cursor-default": pageIndex === page,
                  })}
                  onClick={() =>
                    setPagination((pre) => ({
                      ...pre,
                      pageIndex: Number(page),
                    }))
                  }
                  disabled={pageIndex === page}
                >
                  {Number(page) + 1}
                </Button>
              )}
            </>
          ))}
          {/* btn to go forward */}

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPagination((pre) => ({
                ...pre,
                pageIndex: pre.pageIndex + 1,
              }));
            }}
            disabled={pageIndex === totalPage - 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPagination((pre) => ({ ...pre, pageIndex: totalPage - 1 }));
            }}
            disabled={pageIndex === totalPage - 1}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
