const MenuDish = ({ classes }: any) => {
  return (
    <div
      className={`${classes} relative animate-pulse w-full bg-gray-200 dark:bg-gray-900 rounded-xl`}
    >
      <div className="absolute flex h-full w-full flex-col gap-3 p-5 pb-10">
        <div className="flex flex-col justify-end h-full gap-5">
          <p className="w-2/5 h-5 bg-gray-300 dark:bg-gray-700 rounded-xl"></p>
          <p className="h-5 bg-gray-300 dark:bg-gray-700 rounded-xl"></p>
          <p className="h-5 bg-gray-300 dark:bg-gray-700 rounded-xl"></p>
        </div>
      </div>
    </div>
  );
};

export default MenuDish;
