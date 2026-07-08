import type { Meta, StoryObj } from "@storybook/react";
import { Campaign } from "./Campaign";

const meta: Meta<typeof Campaign> = {
  title: "Wanderlust/UI/Views/Campaign",
  component: Campaign,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Campaign>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Campaign />
    </div>
  ),
};
