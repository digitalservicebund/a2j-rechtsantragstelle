import { useEffect } from "react";

const HEADING_ONE_TAG = "h1";

export const useFocusHeadingTag = () => {
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      const headingOneTag = document.querySelectorAll(HEADING_ONE_TAG);

      if (headingOneTag.length > 0) {
        headingOneTag[0].setAttribute("tabindex", "-1");
        headingOneTag[0].focus();
      }
    }, 0);
    return () => clearTimeout(focusTimer);
  }, []);
};
