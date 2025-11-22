
import { ToggleButtonGroup } from "@wanderlust/ui";
import { MouseEvent, useState } from "react";
import { StyledMediaViewType } from "./MediaViewType.styles";

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

// const cloneIcon = (icon: ReactElement) => {
//   return cloneElement(icon, {
//     style: { fontSize: 20 },
//   });
// };

export function MediaViewType() {
  const [value, setValue] = useState("all");

  const buttons = [
    {
      label: "All",
      value: "all",
      icon: <DashboardOutlinedIcon />,
      selectedIcon: <DashboardIcon />
    },
    {
      label: "Image",
      value: "image",
      icon: <PhotoOutlinedIcon />,
      selectedIcon: <InsertPhotoIcon />,
    },
    {
      label: "Audio",
      value: "audio",
      icon: <MusicNoteOutlinedIcon />,
      selectedIcon: <MusicNoteIcon />,
    },
    {
      label: "Video",
      value: "Video",
      icon: <VideoCameraBackOutlinedIcon />,
      selectedIcon: <VideoCameraBackIcon />,
    },
  ];

  const handleChange = (_: MouseEvent, value: string) => {
    setValue(value);
  };

  return (
    <StyledMediaViewType>
      <ToggleButtonGroup value={value} buttons={buttons} onChange={handleChange} />
    </StyledMediaViewType>
  );
}
