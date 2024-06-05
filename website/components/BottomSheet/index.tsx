import Reels from "@/components/Reel";
import { useEffect } from "react";

const BottomSheet = ({
  isOpen,
  onClose,
  name,
  items,
}: {
  isOpen: boolean;
  onClose: any;
  name: string;
  items: any;
}) => {
  useEffect(() => {
    const handlePopState = () => {
      onClose();
    };

    if (isOpen) {
      window.history.pushState({ bottomSheetOpen: true }, "");
      document.body.classList.add("overflow-hidden");
      window.addEventListener("popstate", handlePopState);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (window.history.state?.bottomSheetOpen) {
      window.history.back();
    } else {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end ${
        isOpen ? "block" : "hidden"
      }`}
    >
      {/* <div className="fixed inset-0" onClick={onClose}></div> */}
      <header className="select-none header left-0 top-0 z-40 w-full items-center absolute p-3 flex gap-2 text-white">
        <button
          onClick={handleClose}
          className="flex gap-2 items-center bg-primary bg-opacity-50 dark:bg-opacity-30 border-b border-primary dark:border-opacity-50 px-3 py-1 text-sm font-semibold rounded-lg"
        >
          <span>{"<"}</span>
          Back
        </button>
        <span>|</span>
        <p className="font-bold text-sm">{name}</p>
      </header>
      <div className="h-full w-full bg-white dark:bg-black">
        <Reels dishesData={items} />
      </div>
    </div>
  );
};

export default BottomSheet;
