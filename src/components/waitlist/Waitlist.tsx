'use client'

import { useEffect, useState } from 'react'
import { fetchWaitlist, updateWaitlistOrder, markAsServiced } from '@/lib/api'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import WaitlistItem from './WaitlistItem'
import moment from 'moment-timezone'

export default function Waitlist({
  refreshTrigger,
}: {
  refreshTrigger: number
}) {
  const [entries, setEntries] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const today = moment().utc().format('YYYY-MM-DD')

  useEffect(() => {
    fetchWaitlist(today).then((waitlist) => {
      if (waitlist && Array.isArray(waitlist.entries)) {
        const sortedEntries = [...waitlist.entries].sort(
          (a, b) => a.orderIndex - b.orderIndex
        )
        setEntries(sortedEntries)
      } else {
        console.warn('Waitlist entries are not an array:', waitlist.entries)
        setEntries([])
      }
    })
  }, [refreshTrigger])

  const moveEntry = (dragIndex: number, hoverIndex: number) => {
    const draggedItem = entries[dragIndex]
    const newEntries = [...entries]
    newEntries.splice(dragIndex, 1)
    newEntries.splice(hoverIndex, 0, draggedItem)

    const orderedEntries = newEntries.map((entry, index) => ({
      ...entry,
      orderIndex: index,
    }))

    setEntries(orderedEntries)

    updateWaitlistOrder(orderedEntries)
  }

  const handleMarkAsServiced = async (entryId: number) => {
    const entry = entries.find((e) => e.id === entryId)
    if (!entry) {
      console.error(`❌ Entry not found: ${entryId}`)
      return
    }

    const waitlistId = entry.waitlistId
    if (!waitlistId) {
      console.error(`❌ Waitlist ID not found for entry: ${entryId}`)
      return
    }

    try {
      const updatedStatus = entry.status === 'SERVED' ? 'WAITING' : 'SERVED'
      await markAsServiced(waitlistId, entryId, updatedStatus)

      setEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.id === entryId ? { ...e, status: updatedStatus } : e
        )
      )
    } catch (error) {
      console.error('❌ Error marking as serviced:', error)
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.puppyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='bg-white p-6 rounded shadow mt-6 w-96'>
        <h2 className='text-lg font-semibold text-gray-800 mb-3'>
          Today's Waitlist
        </h2>

        <input
          type='text'
          placeholder='Search by Puppy or Owner'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-2 border rounded mb-3'
        />

        {filteredEntries.length === 0 ? (
          <p className='text-gray-500'>No entries found.</p>
        ) : (
          <ul>
            {filteredEntries.map((entry, index) => (
              <WaitlistItem
                key={entry.id}
                entry={entry}
                index={index}
                moveEntry={moveEntry}
                handleMarkAsServiced={handleMarkAsServiced}
                userTimezone={userTimezone}
              />
            ))}
          </ul>
        )}
      </div>
    </DndProvider>
  )
}
