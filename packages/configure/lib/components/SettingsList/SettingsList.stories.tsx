import React from "react";
import { Meta } from "@storybook/react";
import { SettingsList } from "./SettingsList";
import { ISettingsGroup } from "@core/types";

export default {
  title: "Configure/Components/SettingsList",
  component: SettingsList,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    settings: { control: "object" },
  },
  args: {
    settings: [
      {
        label: "General",
        description: "General application settings",
        settings: [
          {
            key: "theme",
            label: "Theme",
            type: "select",
            options: ["light", "dark"],
            value: "light",
          },
          {
            key: "notifications",
            label: "Enable Notifications",
            type: "boolean",
            value: true,
          },
        ],
      },
      {
        label: "Account Settings",
        description: "User account settings",
        settings: [
          {
            key: "username",
            label: "Username",
            type: "text",
            value: "john_doe",
          },
          {
            key: "email",
            label: "Email",
            type: "email",
            value: "john_doe@example.com",
          },
        ],
      },
    ],
  },
};
