import type { Meta, StoryObj } from "@storybook/react";
import { ActorDetail } from "./ActorDetail";

const meta: Meta<typeof ActorDetail> = {
  title: "Wanderlust/UI/Views/Actor Detail",
  component: ActorDetail,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ActorDetail>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <ActorDetail />
    </div>
  ),
};
