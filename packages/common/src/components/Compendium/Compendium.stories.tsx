import type { Meta, StoryObj } from "@storybook/react";
import { Compendium } from "./Compendium";

const meta: Meta<typeof Compendium> = {
  title: "Wanderlust/UI/Views/Compendium",
  component: Compendium,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Compendium>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Compendium />
    </div>
  ),
};
