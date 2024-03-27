import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  total: number;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  quote: string;
  children: ReactNode;
  isLoading: boolean;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  quote,
  children,
  isLoading,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : (
            <h4 className="text-title-md text-right font-bold text-black dark:text-white">
              {total}
            </h4>
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>

      <div className="mt-4 text-right">
        {/* <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp && "text-meta-3"
          } ${levelDown && "text-meta-5"} `}
        >
          {rate}

          {levelUp && (
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          )}
          {levelDown && (
            <svg
              className="fill-meta-5"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          )}
        </span> */}
      </div>
      <div className="text-green-700 text-sm">{quote}</div>
    </div>
  );
};

export default CardDataStats;
