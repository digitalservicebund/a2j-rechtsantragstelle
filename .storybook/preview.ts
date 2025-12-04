import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { sb } from "storybook/test";

sb.mock(import("../app/services/analytics/surveys/fetchSurveys.ts"), {
  spy: true,
});
sb.mock(import("../app/services/analytics/useAnalytics.ts"), {
  spy: true,
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    showKernUX: {
      description: "Enable KERN UX Design System",
      defaultValue: false,
      toolbar: {
        title: "KERN UX",
        items: [
          { value: true, title: "KERN Design" },
          { value: false, title: "Legacy Design" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const showKernUX = context.globals.showKernUX;

      useEffect(() => {
        const loadStyles = async () => {
          try {
            if (typeof document !== "undefined") {
              // Remove all existing style tags from dynamic imports
              const allStyleTags = document.querySelectorAll(
                "style[data-vite-dev-id]",
              );
              allStyleTags.forEach((tag) => {
                const id = tag.getAttribute("data-vite-dev-id");
                if (
                  id?.includes("styles.css") ||
                  id?.includes("styles.kern.css")
                ) {
                  tag.remove();
                }
              });

              const kernLink = document.querySelector(
                'link[href*="styles.kern.css"]',
              );
              const legacyLink = document.querySelector(
                'link[href*="styles.css"]:not([href*="kern"])',
              );
              if (kernLink) kernLink.remove();
              if (legacyLink) legacyLink.remove();
            }

            if (showKernUX) {
              // Dynamically import KERN styles
              // @ts-ignore - CSS module import
              await import("../app/styles.kern.css");
              if (typeof document !== "undefined") {
                document.documentElement.setAttribute(
                  "data-kern-theme",
                  "light",
                );
              }
            } else {
              // Dynamically import legacy styles
              // @ts-ignore - CSS module import
              await import("../app/styles.css");
              if (typeof document !== "undefined") {
                document.documentElement.removeAttribute("data-kern-theme");
              }
            }
          } catch (error) {
            console.error("Failed to load styles:", error);
          }
        };

        loadStyles();
      }, [showKernUX]);

      return Story();
    },
  ],
};

export default preview;
