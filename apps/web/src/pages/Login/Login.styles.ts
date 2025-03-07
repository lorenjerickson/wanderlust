import styled from 'styled-components'

export const StyledLogin = styled.div`
    .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 200px auto;

        * {
            background: transparent;
        }

        .title {
            font-size: 128px;
            font-weight: 300;
        }

        .subtitle {
            font-weight: 300;
            font-size: 24px;
            margin-bottom: 32px;
        }

        .form {
            padding: 24px;

            .login {
                margin-bottom: 32px;
            }
        }
    }
`
