const Pagination = ({ items, pageSize, currentPage, onPageChange }: any) => {
  const pagesCount = Math.ceil(items / pageSize); // 100/10

  if (pagesCount === 1) return null;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  return (
    <div>
      <ul className="flex list-none items-center justify-between">
        {pages.map((page) => (
          <li
            key={page}
            className={`flex h-8 w-8 items-center justify-center ${
              page === currentPage ? "bg-reg-500" : ""
            }`}
          >
            <a className="cursor-pointer" onClick={() => onPageChange(page)}>
              {page}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
