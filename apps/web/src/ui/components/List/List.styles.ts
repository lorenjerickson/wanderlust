import styled from "styled-components";

export const StyledList = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      list-style-type: none;
      padding: 1rem 0;
      .left {
        margin-right: 1rem;
      }
      .content {
        flex-grow: 1;
      }
      .right {
        margin-left: 1rem;
      }
    }
  }
`;
