import React from "react";
import Pagination from "./Pagination";

type PageProps = {
  currentPage: number;
  totalProducts: number;
  perPage: number;
  onPageChange: any;
};

const PaginationPage = ({
  currentPage,
  totalProducts,
  perPage,
  onPageChange,
}: PageProps): JSX.Element => {
  return (
    <div>
      {/* <div>Page {currentPage}</div> */}
      <Pagination
        totalItems={totalProducts}
        currentPage={currentPage}
        itemsPerPage={perPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default PaginationPage;
