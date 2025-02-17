import "../../theme/theme.scss";
import List from "./List";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Wanderlust/Components/List",
  component: List,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    items: { control: "object" },
    compact: { control: "boolean" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    items: [
      {
        title: "Item 1",
        subtitle: "Description 1",
      },
      {
        title: "Item 2",
        subtitle: "Description 2",
      },
      {
        title: "Item 3",
        subtitle: "Description 3",
      },
    ],
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    compact: false
  },
};

export const Compact = {
  args: {
    compact: true
  },
};

export const Empty = {
  args: {
    items: []
  },
};

export const WithTrailingElement = {
  args: {
    compact: true,
    items: [
      {
        title: "Item 1",
        subtitle: "Description 1",
        trailingElement: "X"
      },
      {
        title: "Item 2",
        subtitle: "Description 2",
        trailingElement: "X"
      },
      {
        title: "Item 3",
        subtitle: "Description 3",
        trailingElement: "X"
      },
    ],
  },
};

export const WithLeadingElement = {
  args: {
    compact: true,
    items: [
      {
        title: "Item 1",
        subtitle: "Description 1",
        leadingElement: "X"
      },
      {
        title: "Item 2",
        subtitle: "Description 2",
        leadingElement: "X"
      },
      {
        title: "Item 3",
        subtitle: "Description 3",
        leadingElement: "X"
      },
    ],
  },
};

export const WithLeadingAndTrailingElement = {
  args: {
    compact: true,
    items: [
      {
        title: "Item 1",
        subtitle: "Description 1",
        leadingElement: "X",
        trailingElement: "Y"
      },
      {
        title: "Item 2",
        subtitle: "Description 2",
        leadingElement: "X",
        trailingElement: "Y"
      },
      {
        title: "Item 3",
        subtitle: "Description 3",
        leadingElement: "X",
        trailingElement: "Y"
      },
    ],
  },
};


