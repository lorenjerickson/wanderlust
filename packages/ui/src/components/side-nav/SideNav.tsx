import { useEffect, useMemo, useState } from "react";
import { UnstyledButton, Tooltip, Title, rem } from "@mantine/core";
import classes from "./SideNav.module.css";
import { useSideNav, MenuItemConfig } from "../../hooks";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { StyledSidenav } from "./styles";

export function SideNav() {
  const navigate = useNavigate();
  const { sideNavConfig } = useSideNav();
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<MenuItemConfig | null>(null);

  useEffect(() => {
    const firstItem = sideNavConfig?.menuItems?.[0];
    if (firstItem) {
      setActiveItem(firstItem);
    }
  }, [sideNavConfig]);

  const menu = useMemo(() => {
    return sideNavConfig.menuItems?.map((item, index) => {
      return (
        <Tooltip key={index} label={item.label} position="right" withArrow>
          <UnstyledButton
            className={classes.menuItem}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
          </UnstyledButton>
        </Tooltip>
      );
    });
  }, [sideNavConfig]);

  const isActive = (item: MenuItemConfig) => {
    return activeItem === item;
  };

  const submenu = useMemo(() => {
    if (activeItem) {
      return activeItem.menuItems?.map((item, index) => {
        return (
          <Tooltip key={index} label={item.label} position="right" withArrow>
            <UnstyledButton
              className={`submenu-item ${isActive(item) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="icon">{item.icon}</div>
              <div className="label">{item.label}</div>
            </UnstyledButton>
          </Tooltip>
        );
      });
    } else {
      return null;
    }
  }, [activeItem]);

  return (
    <StyledSidenav open={isOpen}>
      <div className="container">
        <div className="main-menu">{menu}</div>
        <div className="sub-menu">{submenu}</div>
      </div>
    </StyledSidenav>
  );
}
