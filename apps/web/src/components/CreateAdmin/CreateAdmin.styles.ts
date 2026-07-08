import styled from 'styled-components'

export const StyledCreateAdmin = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    h1 {
        margin: 0 auto 24px auto;
        margin-bottom: 24px;
        font-size: 32px;
    }
    h2 {
        margin: 0 auto 24px auto;
        margin-bottom: 24px;
        font-size: 24px;
    }
    p {
        margin: 0 auto 24px auto;
        margin-bottom: 24px;
        max-width: 300px;
    }

    .form {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        width: 300px;

        .input {
            width: 300px;
            margin-bottom: 8px;
        }

        .label {
            pointer-events: none;
            font-size: var(--mantine-font-size-xs);
            background: transparent;
        }

        .button {
            width: 300px;
            margin-top: 20px;
        }

        .error {
            color: red;
        }
    }
`
