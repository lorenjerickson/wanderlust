import styled from "styled-components";

export const StyledSettings = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  overflow: auto;
  .list {
    height: 100%;
    max-width: 300px;
    min-width: 200px;
    flex-grow: 1;
    dipslay: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: flex-start;
    align-items: stretch;
    .list-container {
      flex-grow: 1;
    }
  }
  .detail {
    height: 100%;
    flex-grow: 1;
  }
`;
