import styled from "styled-components";

export const StyledSidenav = styled.div<{ open?: boolean }>`
  .container {
    background-color: rgba(32, 32, 32, 0.75);
    height: 100%;
    display: flex;
    flex-direction: row;
    .main-menu {
      background-color: rgba(32, 32, 32, 0.75);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 16px;
      gap: 16px;

      .menu-item {
        background-color: rgba(32, 32, 32, 0.75);
        &.active {
          background-color: #f0f0f0;
        }
      }
    }
    .sub-menu {
      padding: 16px;
      background-color: rgba(32, 32, 32, 0.75);
      display: ${(props) => (props.open ? "inline-block" : "none")};
      border-left: 1px solid #3f3f3f;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .submenu-item {
        background-color: rgba(32, 32, 32, 0.75);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 8px;
        .icon {
          margin-right: 8px;
          background-color: transparent;
        }
        .label {
          background-color: transparent;
        }
      }
    }
  }
`;
