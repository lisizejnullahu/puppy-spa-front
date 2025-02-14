'use client'

import { signOut } from 'next-auth/react'

export default function UserNav() {
  const handleLogout = async () => {
    await signOut({ redirect: false })
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleLogout}
      className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
    >
      Logout
    </button>
  )
}
