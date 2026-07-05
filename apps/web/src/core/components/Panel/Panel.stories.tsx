import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from "./Panel";

const meta: Meta<typeof Panel> = {
  title: "Wanderlust/UI/Layout/Panel",
  component: Panel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  args: {
    id: "panel-story-default",
    title: "Primary Panel",
    statusMessage: "Ready",
    children: "Panel content goes here.",
  },
  render: (args) => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Panel {...args} />
    </div>
  ),
};

export const WithoutFooter: Story = {
  args: {
    id: "panel-story-no-footer",
    title: "Editor",
    children: "Footer is omitted when no status message is provided.",
  },
  render: (args) => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <Panel {...args} />
    </div>
  ),
};
