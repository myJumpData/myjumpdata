import { useEffect, useState } from "react";

const breakpoints: any = {
  480: "xs",
  640: "sm",
  768: "md",
  1024: "lg",
  1280: "xl",
  1536: "2xl",
};

type BreakpointType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const useBreakpoint = (): BreakpointType => {
  const [breakpoint, setBreakPoint] = useState<BreakpointType>("xs");
  const [windowSize, setWindowSize] = useState<{
    width: undefined | number;
    height: undefined | number;
  }>({
    width: undefined,
    height: undefined,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    if (windowSize.width) {
      if (windowSize.width < 480) {
        setBreakPoint(breakpoints[480]);
      }
      if (windowSize.width >= 480 && windowSize.width < 640) {
        setBreakPoint(breakpoints[640]);
      }
      if (windowSize.width >= 640 && windowSize.width < 768) {
        setBreakPoint(breakpoints[768]);
      }
      if (windowSize.width >= 768 && windowSize.width < 1024) {
        setBreakPoint(breakpoints[1024]);
      }
      if (windowSize.width >= 1024 && windowSize.width < 1280) {
        setBreakPoint(breakpoints[1280]);
      }
      if (windowSize.width >= 1280) {
        setBreakPoint(breakpoints[1536]);
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize.width]);
  return breakpoint;
};

export default useBreakpoint;
