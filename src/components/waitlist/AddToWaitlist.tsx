'use client'

import { useState } from 'react'
import { addToWaitlist, fetchWaitlist, createWaitlist } from '@/lib/api'
import moment from 'moment-timezone'

export default function AddToWaitlist({
  onWaitlistUpdate,
}: {
  onWaitlistUpdate: () => void
}) {
  const [puppyData, setPuppyData] = useState({
    puppyName: '',
    ownerName: '',
    serviceNeeded: '',
    timeOfArrival: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const handleAddToWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const todayUTC = moment().utc().format('YYYY-MM-DD')

      let waitlist = await fetchWaitlist(todayUTC)

      if (!waitlist?.id) {
        waitlist = await createWaitlist(todayUTC)
        if (!waitlist?.id) {
          throw new Error('Failed to create waitlist.')
        }
      }

      const fullDateTime = moment
        .tz(`${todayUTC}T${puppyData.timeOfArrival}:00`, userTimezone)
        .utc()
        .toISOString()

      const formattedData = {
        ...puppyData,
        timeOfArrival: fullDateTime,
      }

      const response = await addToWaitlist(waitlist.id, formattedData)

      if (response) {
        onWaitlistUpdate()
        setPuppyData({
          puppyName: '',
          ownerName: '',
          serviceNeeded: '',
          timeOfArrival: '',
        })
      } else {
        throw new Error('Failed to add puppy to waitlist.')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white p-6 rounded shadow mt-6 w-96 text-black'>
      <h2 className='text-lg font-semibold text-gray-800 mb-3'>
        Add to Waitlist
      </h2>
      {error && <p className='text-red-500'>{error}</p>}
      <form onSubmit={handleAddToWaitlist} className='space-y-3'>
        <input
          type='text'
          placeholder='Puppy Name'
          value={puppyData.puppyName}
          onChange={(e) =>
            setPuppyData({ ...puppyData, puppyName: e.target.value })
          }
          className='w-full p-2 border rounded'
          required
        />
        <input
          type='text'
          placeholder='Owner Name'
          value={puppyData.ownerName}
          onChange={(e) =>
            setPuppyData({ ...puppyData, ownerName: e.target.value })
          }
          className='w-full p-2 border rounded'
          required
        />
        <input
          type='text'
          placeholder='Service Needed'
          value={puppyData.serviceNeeded}
          onChange={(e) =>
            setPuppyData({ ...puppyData, serviceNeeded: e.target.value })
          }
          className='w-full p-2 border rounded'
          required
        />
        <input
          type='time'
          value={puppyData.timeOfArrival}
          onChange={(e) =>
            setPuppyData({ ...puppyData, timeOfArrival: e.target.value })
          }
          className='w-full p-2 border rounded'
          required
        />
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded'
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add to Waitlist'}
        </button>
      </form>
    </div>
  )
}
