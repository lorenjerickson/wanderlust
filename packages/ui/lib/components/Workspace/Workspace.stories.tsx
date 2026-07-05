import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from "../Panel";
import { Workspace } from "./Workspace";

const meta: Meta<typeof Workspace> = {
  title: "Wanderlust/UI/Layout/Workspace",
  component: Workspace,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Workspace>;

export const Default: Story = {
  render: (args) => (
    <div style={{ height: "70vh", padding: "1rem", backgroundColor: "#020617" }}>
      <Workspace {...args}>
        <Panel id="left" title="Left" region="left" statusMessage="Navigation ready">
          Navigation and resources
        </Panel>
        <Panel id="middle-center" title="Middle Center" region="middle-center" statusMessage="Editing">
          Primary editing region
        </Panel>
        <Panel id="right" title="Right" region="right" statusMessage="Inspector synced">
          Inspector and metadata
        </Panel>
        <Panel id="middle-top" title="Middle Top" region="middle-top" statusMessage="Overview">
          Overview widgets
        </Panel>
        <Panel id="middle-bottom" title="Middle Bottom" region="middle-bottom" statusMessage="Logs">
          Logs and output
        </Panel>
      </Workspace>
    </div>
  ),
  args: {
    title: "Application Workspace",
  },
};

export const CustomPanels: Story = {
  render: (args) => (
    <div style={{ height: "70vh", padding: "1rem", backgroundColor: "#020617" }}>
      <Workspace {...args}>
        <Panel id="assets" title="Assets" region="left" statusMessage="Library synced">
          Browse and tag uploaded media assets.
        </Panel>
        <Panel id="canvas" title="Canvas" region="middle-center" statusMessage="Ready">
          Main working area for editing and preview.
        </Panel>
        <Panel id="inspector" title="Inspector" region="right" statusMessage="Selection tracked">
          Properties, transforms, and metadata.
        </Panel>
        <Panel id="activity" title="Activity" region="middle-bottom" statusMessage="Streaming">
          Recent events and notifications.
        </Panel>
      </Workspace>
    </div>
  ),
  args: {
    title: "Media Workspace",
  },
};
