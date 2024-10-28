import { Avatar, Text } from '@mantine/core'
import { IconGoGame, IconSunglasses, IconUserCog } from '@tabler/icons-react'
import { User } from '@core'
import classes from './UserInfoIcons.module.css'
import { StyledParticipantTile } from './styles'

export function ParticipantTile({ participant }: { participant: User }) {
    return (
        <StyledParticipantTile>
            <div className="tile">
                <div className="avatar">
                    <Avatar
                        src={`https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${participant.fullName}`}
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
                        <Text>{participant.fullName}</Text>
                    </div>
                    <div className="last-active"></div>
                </div>
            </div>
        </StyledParticipantTile>
    )
}
