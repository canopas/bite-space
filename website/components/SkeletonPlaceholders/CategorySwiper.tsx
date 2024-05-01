const CategorySwiperSkeleton = ({ classes }: any) => {
  return (
    <div
      className={`${classes} h-60 animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
    >
      <div className="h-full w-full flex justify-center">
        <div className="h-full w-[15rem] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-full w-full sm:flex justify-center hidden">
        <div className="h-full w-[15rem] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-full w-full md:flex justify-center hidden">
        <div className="h-full w-[15rem] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-full w-full lg:flex justify-center hidden">
        <div className="h-full w-[15rem] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default CategorySwiperSkeleton;
