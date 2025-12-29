import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import { Footer, Header } from '@wanderlust/ui'

export const getServerProps = async () => {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  // Check for a global admin user; if none, redirect to first‑run setup
  const adminCheck = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
  })
  if (adminCheck.totalDocs === 0) {
    const { redirect } = await import('next/navigation')
    redirect('/create-admin')
  }

  const { user } = await payload.auth({ headers })

  return { user }
}

export default async function HomePage({ user }: { user: any }) {
  return (
    <div className="home">
      <Header user={user} />
      <h1>Home</h1>
      <Footer />
    </div>
  )
}
