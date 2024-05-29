import { useEffect, useState, useRef, RefObject } from "react";

const useAutoplayVisibility = (): [boolean, RefObject<HTMLDivElement>] => {
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAutoplayEnabled(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return [autoplayEnabled, ref];
};

export default useAutoplayVisibility;
