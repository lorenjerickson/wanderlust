import type { Meta, StoryObj } from "@storybook/react";
import { EncounterMap } from "./EncounterMap";

const meta: Meta<typeof EncounterMap> = {
  title: "Wanderlust/UI/Views/Encounter Map",
  component: EncounterMap,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof EncounterMap>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <EncounterMap />
    </div>
  ),
};
