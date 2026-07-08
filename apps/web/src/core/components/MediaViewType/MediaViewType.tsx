import { ToggleButtonGroup } from "../ToggleButtonGroup/ToggleButtonGroup";
import { MouseEvent, useState } from "react";
import { StyledMediaViewType } from "./MediaViewType.styles";
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconMusic,
  IconPhoto,
  IconPhotoFilled,
  IconVideo,
  IconVideoFilled,
} from "@tabler/icons-react";

export function MediaViewType() {
  const [value, setValue] = useState("all");

  const buttons = [
    {
      label: "All",
      value: "all",
      icon: <IconLayoutDashboard size={18} />,
      selectedIcon: <IconLayoutDashboardFilled size={18} />,
    },
    {
      label: "Image",
      value: "image",
      icon: <IconPhoto size={18} />,
      selectedIcon: <IconPhotoFilled size={18} />,
    },
    {
      label: "Audio",
      value: "audio",
      icon: <IconMusic size={18} />,
      selectedIcon: <IconMusic size={18} fill="currentColor" />,
    },
    {
      label: "Video",
      value: "video",
      icon: <IconVideo size={18} />,
      selectedIcon: <IconVideoFilled size={18} />,
    },
  ];

  const handleChange = (_: MouseEvent, nextValue: string) => {
    setValue(nextValue);
  };

  return (
    <StyledMediaViewType>
      <ToggleButtonGroup value={value} buttons={buttons} onChange={handleChange} />
    </StyledMediaViewType>
  );
}
