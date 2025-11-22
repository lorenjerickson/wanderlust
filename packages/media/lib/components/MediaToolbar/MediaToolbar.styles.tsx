import styled from "styled-components";
import { theme } from "@wanderlust/ui";

export const StyledMediaToolbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: transparent;
  border-bottom: 1px solid ${theme.palette.primary.main};
  margin-bottom: 1rem;
  color: "${theme.palette.primary.main}";

  .title-search {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 32px;

    .title {
      color: ${theme.palette.primary.main};

    }

    .search {
      color: ${theme.palette.primary.main};

    }
  }

  .filter {
    .button {
      color: ${theme.palette.primary.main};
    }
  }

  .view {
      color: ${theme.palette.primary.main};
  }
`;
