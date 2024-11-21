import "../../theme/theme.scss";
import styled from "styled-components";

export const StyledSelect = styled.div`
  font-size: 14px;
  background-color: transparent;
  color: #eee;
  border-radius: 6px;
  width: 100%;

  .form-control {
    width: 100%;
    border: none;
    select {
      margin: 0;
      padding: 4px 8px;
      width: 100%;
      border: none;
      background-color: transparent;
    }
  }
`;
