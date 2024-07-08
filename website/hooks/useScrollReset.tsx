import { useRef, useEffect } from "react";

const useScrollReset = (isOpen: boolean) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return contentRef;
};

export default useScrollReset;
