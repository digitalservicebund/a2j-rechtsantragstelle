import { useEffect } from "react";

const HEADING_ONE_TAG = "h1";

export const useFocusFirstH1 = () => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const headingOneTag = document.querySelector(HEADING_ONE_TAG);

      if (headingOneTag) {
        headingOneTag.setAttribute("tabindex", "-1");
        headingOneTag.focus();
      }
    }, 0);
    return () => clearTimeout(focusTimer);
  }, []);
};
