'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/') {
      router.push('/')
    }

    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/' })
    }
  }, [status, session, pathname, router])

  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    )
  }

  return (
    <div className='flex min-h-screen min-w-[100%]'>
      {status === 'authenticated' && <AppSidebar />}
      <SidebarInset className='flex flex-col flex-1'>{children}</SidebarInset>
    </div>
  )
}
