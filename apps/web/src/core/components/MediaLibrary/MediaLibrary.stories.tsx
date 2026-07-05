import type { Meta, StoryObj } from "@storybook/react";
import { MediaLibrary } from "./MediaLibrary";

const meta: Meta<typeof MediaLibrary> = {
  title: "Wanderlust/UI/Views/Media Library",
  component: MediaLibrary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MediaLibrary>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "640px", height: "360px", backgroundColor: "#020617", padding: "1rem" }}>
      <MediaLibrary />
    </div>
  ),
};
