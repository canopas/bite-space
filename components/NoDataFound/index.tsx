const NoDataFound = ({ text }: any) => {
  return (
    <div className="select-none flex flex-col justify-center items-center py-20 sm:py-32 md:py-40">
      <div className="w-fit text-sm sm:text-xl md:text-2xl border-b border-primary border-opacity-20 pb-1 md:pb-2">
        {text}
      </div>
    </div>
  );
};

export default NoDataFound;
