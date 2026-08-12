import styled from 'styled-components'

export const StyledHeader = styled.div`
    header {
        font-family: Montserrat, sans-serif;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-items: space-between;
        align-items: center;
        padding: 16px 24px;
        background-color: transparent;
        color: #000;

        .title {
            font-size: 24px;
            font-weight: 500;
            flex-grow: 1;
        }

        .nav {
            display: flex;
            flex-direction: row;

            flex-grow: 1;
            align-items: center;
            justify-items: center;
            .item {
                a {
                    display: flex;
                    flex-direction: row;
                    justify-items: center;
                    align-items: center;
                    padding: 8px 16px;
                    text-decoration: none;
                    color: #000;
                    .label {
                        align-self: center;
                        font-size: 14px;
                        line-height: 14px;
                    }
                    .icon {
                        display: flex;
                        justify-items: center;
                        align-items: center;
                        flex-direction: column;
                        margin-right: 6px;
                    }
                }

                &:hover {
                    background-color: #f0f0f0;
                }
            }
        }

        .session {
            flex-grow: 1;
        }
    }
`
