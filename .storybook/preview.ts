import type { Preview } from "@storybook/react-vite";
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

      if (typeof document !== "undefined") {
        const existingLink = document.getElementById("storybook-styles");
        if (existingLink) {
          existingLink.remove();
        }

        const link = document.createElement("link");
        link.id = "storybook-styles";
        link.rel = "stylesheet";
        link.href = showKernUX ? "../app/styles.kern.css" : "../app/styles.css";
        document.head.appendChild(link);

        if (showKernUX) {
          document.documentElement.setAttribute("data-kern-theme", "light");
        } else {
          document.documentElement.removeAttribute("data-kern-theme");
        }
      }

      return Story();
    },
  ],
};

export default preview;
