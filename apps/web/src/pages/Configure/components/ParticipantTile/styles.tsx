import styled from 'styled-components'

export const StyledParticipantTile = styled.div`
    .tile {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        .avatar {
            width: 94px;
            height: 94px;
        }
        .detail {
            flex-grow: 1;
            .roles {
                text-transform: uppercase;
                font-weight: 500;
                font-size: 0.75rem;
                color: #6b6b6b;
            }
            .name {
                font-weight: 600;
                font-size: 1.25rem;
                color: #efefef;
            }
            .activity {
                .participation-stat {
                    font-size: 0.75rem;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #6b6b6b;
                }
                .last-active {
                    font-size: 0.75rem;
                    color: #6b6b6b;
                }
            }
        }
    }
`
