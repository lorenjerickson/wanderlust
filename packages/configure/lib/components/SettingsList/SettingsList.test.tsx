import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsList } from "./SettingsList";
import { ISettingsGroup, Role } from "@core/types";
import type { ControlType } from "@core/types";

const settings: ISettingsGroup[] = [
  {
    key: "general",
    label: "General",
    description: "General application settings",
    settings: [
      {
        key: "theme",
        label: "Theme",
        type: "choice" as ControlType,
        options: [
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
        value: "light",
        description: "",
        required: false,
        ownership: {},
      },
      {
        key: "notifications",
        label: "Enable Notifications",
        type: "toggle",
        value: true,
        description: "",
        required: false,
        ownership: {}
      },
    ],
  },
  {
    key: "account",
    label: "Account Settings",
    description: "User account settings",
    settings: [
      {
        key: "username",
        label: "Username",
        type: "text",
        value: "john_doe",
        description: "",
        required: false,
        ownership: {},
      },
      {
        key: "email",
        label: "Email",
        type: "text",
        value: "john_doe@example.com",
        description: "",
        required: false,
        ownership: {}
      },
    ],
  },
];

describe("SettingsList", () => {
  test("renders settings groups and settings", () => {
    render(<SettingsList settings={settings} />);
    expect(screen.getByText("General Settings")).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Enable Notifications")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  test("handles setting changes", () => {
    render(<SettingsList settings={settings} />);
    const themeSelect = screen.getByLabelText("Theme");
    fireEvent.change(themeSelect, { target: { value: "dark" } });
    expect(console.log).toHaveBeenCalledWith(
      "Setting changed",
      "theme",
      "dark"
    );
  });
});
