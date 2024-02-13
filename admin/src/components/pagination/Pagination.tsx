import Link from "next/link";
import React from "react";
import usePagination from "./hooks";

export type PaginationProps = {
  totalItems: number;
  currentPage: number;
  onPageChange: any;
  itemsPerPage?: number;
};

export const dotts = "...";

const Pagination = ({
  totalItems,
  currentPage,
  itemsPerPage = 10,
  onPageChange,
}: PaginationProps) => {
  const pages = usePagination(totalItems, currentPage, itemsPerPage);

  return (
    <div className="my-8 flex items-center justify-center">
      {pages.map((pageNumber: any, i: any) =>
        pageNumber === dotts ? (
          <span
            key={i}
            className="rounded-full px-4 py-2 text-sm font-semibold text-black"
          >
            {pageNumber}
          </span>
        ) : (
          <p
            key={i}
            onClick={() => onPageChange(pageNumber)}
            className={`${
              pageNumber === currentPage
                ? "border-b border-black py-1.5 text-black"
                : "py-2 text-slate-500"
            } mx-1 cursor-pointer px-4 text-sm font-semibold no-underline`}
          >
            {pageNumber}
          </p>
        ),
      )}
    </div>
  );
};

export default Pagination;
