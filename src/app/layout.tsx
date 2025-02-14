'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import SessionProvider from '@/components/SessionProvider'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen antialiased`}
      >
        <ThemeProvider>
          <SessionProvider>
            <SidebarProvider>
              <AuthenticatedLayout>{children}</AuthenticatedLayout>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
