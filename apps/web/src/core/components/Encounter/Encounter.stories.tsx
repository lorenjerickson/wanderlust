import type { Meta, StoryObj } from "@storybook/react";
import { Encounter } from "./Encounter";

const meta: Meta<typeof Encounter> = {
  title: "Wanderlust/UI/Views/Encounter",
  component: Encounter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Encounter>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Encounter />
    </div>
  ),
};
