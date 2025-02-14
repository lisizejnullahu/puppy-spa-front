'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset } from '@/components/ui/sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  const isAuthenticated = !!session?.user
  const isLoginPage = pathname === '/'

  return (
    <div className='flex min-h-screen min-w-[100%]'>
      {isAuthenticated && !isLoginPage && <AppSidebar />}
      <SidebarInset className='flex flex-col flex-1'>{children}</SidebarInset>
    </div>
  )
}
