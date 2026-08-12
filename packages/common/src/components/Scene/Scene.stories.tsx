import type { Meta, StoryObj } from "@storybook/react";
import { Scene } from "./Scene";

const meta: Meta<typeof Scene> = {
  title: "Wanderlust/UI/Views/Scene",
  component: Scene,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Scene>;

export const Default: Story = {
  args: {
    statusMessage: "",
  },
  render: (args) => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Scene {...args} />
    </div>
  ),
};
