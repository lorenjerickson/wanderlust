import React from "react";

import MuiList from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";

type ListItemProps = {
  id?: string;
  leadingElement?: React.ReactNode;
  avatarImageURL?: string;
  title: React.ReactNode;
  checked?: boolean;
  subtitle?: React.ReactNode;
  trailingElement?: React.ReactNode;
};

type ListProps = {
  compact?: boolean;
  selectable?: boolean;
  onPrimaryAction?: (item: ListItemProps) => void;
  onSecondaryAction?: (item: ListItemProps) => void;
  onSelectionChanged?: (item: ListItemProps) => void;
  onClick?: (item: ListItemProps) => void;
  items: Array<ListItemProps>;
};

export function List(props: ListProps) {
  const {
    items,
    selectable,
    onSecondaryAction,
    onSelectionChanged,
    onClick,
    compact
  } = props;

  const handleClick = (item: ListItemProps) => {
    if (onClick) {
      onClick(item);
    }
  };

  const handleSelectionChanged = (item: ListItemProps) => {
    if (onSelectionChanged) {
        onSelectionChanged(item);
    }
  };

  const handleSecondaryAction = (item: ListItemProps) => {
    if (onSecondaryAction) {
      onSecondaryAction(item);
    }
  };

  return (
    <MuiList sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} dense={compact}>
      {items.map((item, index) => {
        const labelId = `checkbox-list-label-${item.id}`;

        return (
          <ListItem
            key={item.id || index}
            secondaryAction={
              item.trailingElement && (
                <IconButton
                  edge="end"
                  onClick={() => handleSecondaryAction(item)}
                >
                  {item.trailingElement}
                </IconButton>
              )
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={() => handleClick(item)}
              dense
            >
              {selectable && (
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    onChange={() => handleSelectionChanged(item)}
                  />
                </ListItemIcon>
              )}

              {item.avatarImageURL && (
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar for ${item.title}`}
                    src={item.avatarImageURL}
                  />
                </ListItemAvatar>
              )}
              <ListItemText
                id={labelId}
                primary={item.title}
                secondary={item.subtitle}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </MuiList>
  );
}
