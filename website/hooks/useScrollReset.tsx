import { useRef, useEffect } from "react";

const useScrollReset = (isOpen: boolean) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("ref called");
    if (isOpen && contentRef.current) {
      console.log(contentRef.current.scrollTop);
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return contentRef;
};

export default useScrollReset;
