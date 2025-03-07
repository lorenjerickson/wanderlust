import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useSideNav } from "./useSideNav";

export function SideNav() {
  const { items, isOpen } = useSideNav();

  const DrawerList = (
    <Box
      sx={{ width: isOpen ? 250 : 48, background: "rgba(0,0,0,0.5)" }}
      role="presentation"
    >
      <List>
        {items.map(({ label }, index) => (
          <ListItem key={label} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>  
    </Box>
  );

  return (
    <div>
      <Drawer sx={{ background: "rgba(0,0,0,0.5)" }} open={true}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
