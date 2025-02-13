'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddToWaitlist from '@/components/waitlist/AddToWaitlist'
import Waitlist from '@/components/waitlist/Waitlist'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/login')
    }
  }, [session, status])

  if (status === 'loading') return <p>Loading...</p>
  if (!session?.user) return null

  const handleWaitlistUpdate = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <div className='text-black flex flex-col items-center mt-10'>
      <div className='flex justify-between w-full max-w-lg'>
        <h1 className='text-xl font-bold'>Welcome, {session.user.username}!</h1>
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Logout
        </button>
      </div>

      <AddToWaitlist onWaitlistUpdate={handleWaitlistUpdate} />
      <Waitlist refreshTrigger={refreshTrigger} />
    </div>
  )
}
