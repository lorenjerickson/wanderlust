import type { Meta, StoryObj } from "@storybook/react";
import { Actors } from "./Actors";

const meta: Meta<typeof Actors> = {
  title: "Wanderlust/UI/Views/Actors",
  component: Actors,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Actors>;

export const Default: Story = {
  args: {
    statusMessage: "",
  },
  render: (args) => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Actors {...args} />
    </div>
  ),
};
