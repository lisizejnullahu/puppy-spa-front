'use client'

import { useState } from 'react'
import Waitlist from '../../../components/waitlist/WaitlistTable'

export default function WaitlistPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Today's Waitlist</h1>
      <Waitlist refreshTrigger={refreshTrigger} />
    </div>
  )
}
