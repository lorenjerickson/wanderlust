/** @type { import('@storybook/react').Preview } */
import "../packages/ui/lib/theme/theme.scss";
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
