import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React from "react";

function generate(element: React.ReactElement<unknown>) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

type ListProps = {
  compact: boolean;
  items: Array<{
    leadingElement?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    trailingElement?: React.ReactNode;
  }>;
};

export function MyList(props: ListProps) {
  const { compact, items } = props;
  return (
    <List dense={compact}>
      {items.map((item) =>
        generate(
          <ListItem
            secondaryAction={
              item.trailingElement ? (
                <IconButton>{item.trailingElement}</IconButton>
              ) : null
            }
          >
            {item.leadingElement ? (
              <ListItemAvatar>{item.leadingElement}</ListItemAvatar>
            ) : null}
            <ListItemText
              primary={item.title}
              secondary={item.subtitle ? "Secondary text" : null}
            />
          </ListItem>
        )
      )}
    </List>
  );
}

export default List;
