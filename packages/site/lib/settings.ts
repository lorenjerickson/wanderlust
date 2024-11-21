import { ISettingsGroup } from "@wanderlust/core";

const settings: ISettingsGroup = {
  key: "site",
  label: "Site Settings",
  description: "Settings for the site module",
  settings: [
    {
      key: "title",
      label: "Site Title",
      description: "The title of the site. Shown in the site header.",
      required: true,
      defaultValue: "Wanderlust Starter",
      type: "text",
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "description",
      label: "Site Description",
      description: "A short description of the site.",
      type: "text",
      defaultValue: "",
      required: false,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "logo",
      label: "Site Logo",
      description: "The URL to the site logo.",
      type: "text",
      defaultValue: "",
      required: false,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "favicon",
      label: "Site Favicon",
      description: "The URL to the site favicon.",
      type: "text",
      defaultValue: "",
      required: false,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "theme",
      label: "Site Theme",
      description: "The theme to use for the site.",
      type: "choice",
      options: [
        { label: "Default", value: "default" },
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
      ],
      defaultValue: "default",
      required: true,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "language",
      label: "Site Language",
      description: "The language to use for the site.",
      type: "choice",
      options: [
        { label: "English", value: "en" },
        { label: "Spanish", value: "es" },
        { label: "French", value: "fr" },
      ],
      defaultValue: "en",
      required: true,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "timezone",
      label: "Site Timezone",
      description: "The timezone to use for the site.",
      type: "choice",
      options: [
        { label: "UTC", value: "utc" },
        { label: "PST", value: "pst" },
        { label: "MST", value: "mst" },
        { label: "CST", value: "cst" },
        { label: "EST", value: "est" },
      ],
      defaultValue: "utc",
      required: true,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
    {
      key: "adminEmail",
      label: "Admin Email",
      description: "The email address of the site administrator.",
      type: "text",
      defaultValue: "",
      required: true,
      ownership: {
        roles: {
          admin: ["read", "write"],
        },
        participants: {
          admin: [],
        },
      },
    },
  ],
};

export default settings;
