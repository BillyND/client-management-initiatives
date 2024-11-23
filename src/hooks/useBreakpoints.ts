import { useEffect, useState } from "react";

// Breakpoint values in pixels
const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

interface BreakpointQueries {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * A custom hook that returns boolean flags for different device breakpoints
 * @returns Object with device breakpoint flags (isMobile, isTablet, isDesktop)
 */
const useBreakpoints = (): BreakpointQueries => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events to optimize performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isMobile = width < breakpoints.mobile;
  const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
  const isDesktop = width >= breakpoints.tablet;

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useBreakpoints;
