import { User } from '@/core/types'
import { useParticipants } from '@/hooks/useParticipants'
import { useState } from 'react'

// const data = [
//   {
//     avatar:
//       'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png',
//     name: 'Robert Wolfkisser',
//     job: 'Engineer',
//     email: 'rob_wolf@gmail.com',
//     role: 'Collaborator',
//     lastActive: '2 days ago',
//     active: true,
//   },
// ];

const rolesData = ['gamemaster', 'admin', 'player', 'spectator']

export function Participants() {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const { data: participants, isLoading } = useParticipants({
        roles: selectedRoles,
    })

    return (
        <div>
            <h1>Participants</h1>
            <div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        {participants &&
                            participants.map((participant: User) => (
                                <div key={participant.name}>
                                    <div>
                                        <img
                                            src={participant.avatar}
                                            alt={participant.name}
                                        />
                                        <h2>{participant.name}</h2>
                                        <p>{participant.role}</p>
                                        <p>{participant.lastActive}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    )
}
