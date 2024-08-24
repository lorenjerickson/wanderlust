import { Avatar, Text } from '@mantine/core'
import { IconGoGame, IconSunglasses, IconUserCog } from '@tabler/icons-react'
import { Participant } from '@wanderlust/core'
import classes from './UserInfoIcons.module.css'
import { StyledParticipantTile } from './styles'

export function ParticipantTile({ participant }: { participant: Participant }) {
    return (
        <StyledParticipantTile>
            <div className="tile">
                <div className="avatar">
                    <Avatar
                        src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${participant.name}`}
                        size={94}
                        radius="md"
                    />
                </div>
                <div className="detail">
                    <div className="roles">
                        <Text>
                            {participant.roles[0]}{' '}
                            {participant.roles.length > 1 &&
                                `+${participant.roles.length - 1} more`}
                        </Text>
                    </div>
                    <div className="name">
                        <Text>{participant.name}</Text>
                    </div>
                    <div className="activity">
                        <div className="participation-stat">
                            <IconGoGame /> {participant.gamesAs.player}
                        </div>
                        <div className="participation-stat">
                            <IconUserCog />
                            {participant.gamesAs.gameMaster}
                        </div>
                        <div className="participation-stat">
                            <IconSunglasses />
                            {participant.gamesAs.spectator}
                        </div>
                    </div>
                    <div className="last-active"></div>
                </div>
            </div>
        </StyledParticipantTile>
    )
}
