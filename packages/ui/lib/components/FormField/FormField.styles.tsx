import "../../theme/theme.scss";

import styled from "styled-components";

export const StyledFormField = styled.div`
  padding: $spacing-sm $spacing-md;
  margin-bottom: $spacing-md;
  display: flex;
  flex-direction: column;
  .label {
    margin-bottom: $spacing-sm;
    font-size: $font-size-md;
    color: $color;
  }
  .field {
    width: 100%;
    border: 1px solid light-dark($light-color-border, $dark-color-border);
    font-size: $font-size-md;
    background-color: $color-input-background;
    color: $color-input-text;
  }
`;
