import type { Meta, StoryObj } from "@storybook/react";
import { Chat } from "./Chat";

const meta: Meta<typeof Chat> = {
  title: "Wanderlust/UI/Views/Chat",
  component: Chat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Chat>;

export const Default: Story = {
  args: {
    statusMessage: "",
  },
  render: (args) => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Chat {...args} />
    </div>
  ),
};
