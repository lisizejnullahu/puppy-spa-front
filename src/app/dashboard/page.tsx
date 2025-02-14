'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Layout } from '@/components/dashboard/DashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import AddToWaitlist from '@/components/waitlist/AddToWaitlist'
import WaitlistTable from '@/components/waitlist/WaitlistTable'
import ThemeSwitch from '@/components/theme/theme-switch'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (status !== 'loading' && !session?.user) {
      router.push('/')
    }
  }, [session, status, router])

  if (status === 'loading' || !session?.user) return <p>Loading...</p>

  const handleWaitlistUpdate = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const topNav = [
    { title: 'Waitlist', href: '/dashboard/waitlist', isActive: true },
    { title: 'Overview', href: '/dashboard/overview', isActive: false },
    { title: 'Settings', href: '/dashboard/settings', isActive: false },
  ]

  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Tabs defaultValue='waitlist' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='waitlist'>Waitlist</TabsTrigger>
            <TabsTrigger value='overview'>Add Puppies</TabsTrigger>
          </TabsList>

          <TabsContent value='waitlist' className='space-y-4'>
            <WaitlistTable refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value='overview' className='space-y-4'>
            <AddToWaitlist onWaitlistUpdate={handleWaitlistUpdate} />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}
