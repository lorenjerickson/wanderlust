import styled from "styled-components";

export const StyledSettingsList = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: stretch;
  margin-left: 16px;
  .group {
    padding: 16px 16px;
    overflow-y: auto;

    .setting {
      flex-grow: 1;
      overflow-y: auto;
    }
  }
`;
