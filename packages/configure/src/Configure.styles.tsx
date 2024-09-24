import styled from "styled-components"

export const ConfigureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 1024px;
  gap: 1rem;
  margin: 0 auto;
  .container {
    display: flex;
    gap: 1rem;
    .nav {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      flex-grow: 0;
    }
    .content {
      flex-grow: 1;
    }
  }
`
