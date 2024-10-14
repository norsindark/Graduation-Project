import { useState, useEffect, useRef } from 'react';

const useResponsiveModalWidth = (defaultWidth: number = 650) => {
  const hasWindow = typeof window !== 'undefined';
  const [modalWidth, setModalWidth] = useState<number>(
    hasWindow ? window.innerWidth : defaultWidth
  );
  const timeOutId = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 500) {
        setModalWidth(380);
      } else if (width >= 500 && width < 1000) {
        setModalWidth(480);
      } else {
        setModalWidth(680);
      }
    };

    const resizeListener = () => {
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
      timeOutId.current = window.setTimeout(handleResize, 500);
    };

    window.addEventListener('resize', resizeListener);
    handleResize();

    return () => {
      if (timeOutId.current) {
        clearTimeout(timeOutId.current);
      }
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  return modalWidth;
};

export default useResponsiveModalWidth;
