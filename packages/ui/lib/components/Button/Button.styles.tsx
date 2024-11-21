import styled from "styled-components";
import "../../theme/theme.scss";

export const StyledButton = styled.button`
  margin: 0;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 6px;
  background-color: transparent;
  color: $color-input-text;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }

  &.primary {
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.secondary {
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #5a6268;
    }
  }

  &.danger {
    background-color: #dc3545;
    color: white;

    &:hover {
      background-color: #bd2130;
    }
  }
`;
