import { fn } from "@storybook/test";
import { Select } from "./Select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Wanderlust/UI/Components/Select",
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    options: { control: "object" },
    placeholder: { control: "text" },
    className: { control: "text" },
    onChange: { action: "changed" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    options: [
      { value: "option1", label: "option 1" },
      { value: "option2", label: "option 2" },
      { value: "option3", label: "option 3" },
    ],
    placeholder: "Select an option",
    label: "Options",
  },
};
