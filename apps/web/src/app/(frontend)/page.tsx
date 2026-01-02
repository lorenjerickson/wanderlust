import { Footer } from '@/components/footer/Footer'
import { Header } from '@/components/header/Header'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import './styles.css'

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
    <div className="home bg-[url('/api/media/file/rpg-backround-1.jpg')] bg-cover min-h-screen bg-opacity-75 bg-blend-darken">
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen py-20 px-4 text-white">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
          Welcome to Wanderlust
        </h1>
        <p className="text-lg text-center mb-8 drop-shadow-lg">
          Let the adventure begin.
        </p>
      </main>
      <Footer />
    </div>
  )
}
