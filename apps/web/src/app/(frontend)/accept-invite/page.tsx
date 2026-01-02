import { User } from '@/payload-types'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { config } from 'next/dist/build/templates/pages'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'

// Define the expected shape of your props and query for TypeScript
type Invitation = {
  who: {
    firstName: string
    lastName: string
    message: string
    email: string
  }
  invitation: {
    code: string
    invitedBy: User
    invitedOn: string
    acceptedOn?: string
    expiresOn?: string
  }
}

export const getServerSideProps: GetServerSideProps<{
  invitation: Invitation | null
}> = async (context) => {
  const invitationCode = context.params?.code
  const email = context.query?.email
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  // Check for a global admin user; if none, redirect to first‑run setup
  const foundUsers = await payload.find({
    collection: 'users',
    where: {
      email: { equals: email },
    },
    limit: 1,
  })

  const { redirect } = await import('next/navigation')
  if (foundUsers.totalDocs === 0) {
    redirect('/error?c=invalid-invitation')
  }

  const foundInvites = await payload.find({
    collection: 'invitations',
    where: {
      email: { equals: email },
      inviteCode: { equals: invitationCode },
    },
    limit: 1,
  })

  if (foundInvites.totalDocs === 0) {
    redirect('/error?c=invalid-invitation')
  }

  const invitationData = foundInvites.docs[0] as unknown as Invitation

  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/error?c=not-authenticated')
  }

  return { props: { invitation: invitationData } }
}

// The page component receives the props returned by getServerSideProps
export default function InvitationPage({
  invitation,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>{invitation?.invitation.code}</h1>
      <p>Email: {invitation?.who.email}</p>
    </div>
  )
}
