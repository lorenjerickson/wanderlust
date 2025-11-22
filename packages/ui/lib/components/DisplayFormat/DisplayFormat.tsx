import { MouseEvent, useState } from "react";


import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import ViewListIcon from "@mui/icons-material/ViewList";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";

import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";

import { ToggleButtonGroup } from "@lib/main";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";

enum FormatType {
  List = "list",
  Card = "card",
  Grid = "grid",
  Masonry = "masonry",
}

const buttons = [
  {
    value: FormatType.List,
    label: "List",
    icon: <ViewListOutlinedIcon />,
    selectedIcon: <ViewListIcon />,
  },
  {
    value: FormatType.Card,
    label: "Card",
    icon: <CreditCardOutlinedIcon />,
    selectedIcon: <CreditCardIcon />,
  },
  {
    value: FormatType.Grid,
    label: "Large Grid",
    icon: <ViewModuleOutlinedIcon />,
    selectedIcon: <ViewModuleIcon />,
  },
  {
    value: FormatType.Masonry,
    label: "Small Grid",
    icon: <DashboardOutlinedIcon />,
    selectedIcon: <DashboardIcon />,
  },
];

export function DisplayFormat() {
  const [format, setFormat] = useState<FormatType>(FormatType.List);

  const handleChange = (_: MouseEvent, value: string) => {
    setFormat(value as FormatType);
  };

  return (
    <ToggleButtonGroup
      buttons={buttons}
      value={format}
      onChange={handleChange}
    />
  );
}
