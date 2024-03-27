"use client";

import PopularFood from "./popularFood";
import PopularRestaurant from "./popularRestaurant";

const SearchPage = () => {
  return (
    <>
      <div className="my-32">
        <div className="container">
          <div className="relative mb-4 border-b border-b-[#00000014] pb-4 dark:border-b-[#222222] xxs:mb-6 xxs:pb-6 xs:mb-7 xs:pb-7 sm:mb-8 sm:pb-8">
            <svg
              className="absolute left-[15px] top-[10px] h-[0.8rem] xxs:top-[19px] xs:left-[18px] xs:top-4 xs:h-[18px] sm:left-5 sm:top-5 sm:h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M19.7556 18.5773L14.0682 12.8899C15.1698 11.5291 15.8332 9.7999 15.8332 7.9166C15.8332 3.55164 12.2815 0 7.91656 0C3.55161 0 0 3.55161 0 7.91656C0 12.2815 3.55164 15.8332 7.9166 15.8332C9.7999 15.8332 11.5291 15.1699 12.8899 14.0682L18.5773 19.7556C18.7398 19.9181 18.9531 19.9998 19.1665 19.9998C19.3798 19.9998 19.5932 19.9181 19.7557 19.7556C20.0815 19.4298 20.0815 18.9031 19.7556 18.5773ZM7.9166 14.1665C4.46996 14.1665 1.66666 11.3632 1.66666 7.91656C1.66666 4.46992 4.46996 1.66662 7.9166 1.66662C11.3632 1.66662 14.1665 4.46992 14.1665 7.91656C14.1665 11.3632 11.3632 14.1665 7.9166 14.1665Z"
                fill="currentColor"
                fillOpacity="0.6"
              />
            </svg>
            <input
              className="w-full rounded-full border border-[#00000014] py-[0.5rem] pr-6 pl-[2rem] text-[0.5rem] font-medium text-[#00000066]/40 focus:outline-none dark:bg-[#222222] dark:text-[#FFFFFF99]/60 xxs:py-[0.8rem] xxs:pr-9 xxs:pl-[2.3rem] xxs:text-[0.6rem] xs:py-4 xs:pr-12 xs:pl-12 xs:text-xs sm:pr-14 sm:pl-14 sm:text-base"
              type="text"
              placeholder="Search ..."
            />
            <div className="absolute right-[10px] top-[9px] cursor-pointer rounded-full bg-[#0000001F]/10 p-1 text-black dark:bg-[#FFFFFF33]/20 dark:text-white xxs:right-[15px] xxs:top-[17px] xxs:p-1.5 xs:right-[18px] xs:top-3 xs:p-2 sm:right-5 sm:top-4">
              <svg
                className="h-[4px] xxs:h-[5px] xs:h-[8px] sm:h-[10px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 10 10"
                fill="none"
              >
                <path
                  d="M9.72125 1.33625C10.0133 1.04423 10.0133 0.57077 9.72125 0.27875C9.42923 -0.0132705 8.95577 -0.0132706 8.66375 0.27875L5 3.9425L1.33625 0.27875C1.04423 -0.013271 0.57077 -0.0132705 0.27875 0.27875C-0.0132705 0.57077 -0.0132706 1.04423 0.27875 1.33625L3.9425 5L0.27875 8.66375C-0.013271 8.95577 -0.0132705 9.42923 0.27875 9.72125C0.57077 10.0133 1.04423 10.0133 1.33625 9.72125L5 6.0575L8.66375 9.72125C8.95577 10.0133 9.42923 10.0133 9.72125 9.72125C10.0133 9.42923 10.0133 8.95577 9.72125 8.66375L6.0575 5L9.72125 1.33625Z"
                  fill="currentColor"
                  fillOpacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>

        <PopularFood />
        <PopularRestaurant />
      </div>
    </>
  );
};

export default SearchPage;
