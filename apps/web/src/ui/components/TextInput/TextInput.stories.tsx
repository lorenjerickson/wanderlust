import { fn } from "@storybook/test";
import "../../theme/theme.scss";
import { TextInput } from "./TextInput";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: "Wanderlust/Components/TextInput",
  component: TextInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    value: { control: "text" },
    required: { control: "checkbox" },
    className: { control: "text" },
    onChange: { action: "changed" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    placeholder: "Type something",
    label: "Label",
  },
};

export const WithLeadingIcon = {
  args: {
    placeholder: "Type something",
    label: "Label",
    leading: <div>🔍</div>,
  },
};

export const WithTrailingIcon = {
  args: {
    placeholder: "Type something",
    label: "Label",
    trailing: <div>🔍</div>,
  },
};

export const Required = {
  args: {
    placeholder: "Type something",
    label: "Label",
    required: true,
  },
};

export const Disabled = {
  args: {
    placeholder: "Type something",
    label: "Label",
    disabled: true,
  },
};

export const Error = {
  args: {
    placeholder: "Type something",
    label: "Label",
    error: true,
  },
};

export const Password = {
  args: {
    placeholder: "Type something",
    label: "Password",
    type: "password",
  },
};

export const Number = {
  args: {
    placeholder: "Type something",
    label: "Number",
    type: "number",
  },
};

export const Email = {
  args: {
    placeholder: "Type something",
    label: "Email",
    type: "email",
  },
};

export const Search = {
  args: {
    placeholder: "Type something",
    label: "Search",
    type: "search",
  },
};

export const Tel = {
  args: {
    placeholder: "Type something",
    label: "Telephone",
    type: "tel",
  },
};

export const Url = {
  args: {
    placeholder: "Type something",
    label: "URL",
    type: "url",
  },
};

export const Date = {
  args: {
    placeholder: "Type something",
    label: "Date",
    type: "date",
  },
};
