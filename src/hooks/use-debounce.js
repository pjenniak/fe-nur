import {
  useEffect,
  useState,
  useRef,
} from "react";

const useDebounce = (callback, delay, deps) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isFirstRender) {
      callback();
      setIsFirstRender(false);
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);
};

export default useDebounce;
