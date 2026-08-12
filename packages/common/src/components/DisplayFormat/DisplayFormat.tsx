import { MouseEvent, useState } from "react";
import {
  IconCards,
  IconCardsFilled,
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconLayoutGrid,
  IconLayoutGridFilled,
  IconList,
  IconListDetails,
} from "@tabler/icons-react";

import { ToggleButtonGroup } from "../ToggleButtonGroup/ToggleButtonGroup";

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
    icon: <IconList size={18} />,
    selectedIcon: <IconListDetails size={18} />,
  },
  {
    value: FormatType.Card,
    label: "Card",
    icon: <IconCards size={18} />,
    selectedIcon: <IconCardsFilled size={18} />,
  },
  {
    value: FormatType.Grid,
    label: "Large Grid",
    icon: <IconLayoutGrid size={18} />,
    selectedIcon: <IconLayoutGridFilled size={18} />,
  },
  {
    value: FormatType.Masonry,
    label: "Small Grid",
    icon: <IconLayoutDashboard size={18} />,
    selectedIcon: <IconLayoutDashboardFilled size={18} />,
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
