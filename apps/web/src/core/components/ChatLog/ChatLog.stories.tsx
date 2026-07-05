import type { Meta, StoryObj } from "@storybook/react";
import { ChatLog } from "./ChatLog";

const meta: Meta<typeof ChatLog> = {
  title: "Wanderlust/UI/Views/Chat Log",
  component: ChatLog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ChatLog>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <ChatLog />
    </div>
  ),
};
