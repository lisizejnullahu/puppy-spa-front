'use client'

import { useEffect, useState } from 'react'
import { fetchWaitlist, updateWaitlistOrder, markAsServiced } from '@/lib/api'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import moment from 'moment-timezone'

export type WaitlistEntry = {
  id: number
  puppyName: string
  ownerName: string
  serviceNeeded: string
  timeOfArrival: string
  orderIndex: number
  status: 'WAITING' | 'SERVED'
  waitlistId: number
}

const ItemType = 'ENTRY'

export default function WaitlistTable({
  refreshTrigger,
}: {
  refreshTrigger: number
}) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const today = moment().utc().format('YYYY-MM-DD')

  useEffect(() => {
    fetchWaitlist(today).then((waitlist) => {
      if (waitlist?.entries) {
        const sortedEntries = [...waitlist.entries].sort(
          (a, b) => a.orderIndex - b.orderIndex
        )
        setEntries(sortedEntries)
      } else {
        setEntries([])
      }
    })
  }, [refreshTrigger])

  const handleMarkAsServiced = async (entryId: number) => {
    const entry = entries.find((e) => e.id === entryId)
    if (!entry) return

    try {
      const updatedStatus = entry.status === 'SERVED' ? 'WAITING' : 'SERVED'
      await markAsServiced(entry.waitlistId, entryId, updatedStatus)

      setEntries((prevEntries) =>
        prevEntries.map((e) =>
          e.id === entryId ? { ...e, status: updatedStatus } : e
        )
      )
    } catch (error) {
      console.error('Error marking as serviced:', error)
    }
  }

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

  const filteredEntries = entries.filter(
    (entry) =>
      entry.puppyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='w-full'>
        <div className='flex items-center py-4'>
          <Input
            id='search'
            placeholder='Search by Puppy or Owner...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-sm'
          />
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Puppy Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Service Needed</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Serviced</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length ? (
                filteredEntries.map((entry, index) => (
                  <WaitlistItem
                    key={entry.id}
                    entry={entry}
                    index={index}
                    moveEntry={moveEntry}
                    handleMarkAsServiced={handleMarkAsServiced}
                    userTimezone={userTimezone}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DndProvider>
  )
}

function WaitlistItem({
  entry,
  index,
  moveEntry,
  handleMarkAsServiced,
  userTimezone,
}: {
  entry: WaitlistEntry
  index: number
  moveEntry: (dragIndex: number, hoverIndex: number) => void
  handleMarkAsServiced: (entryId: number) => void
  userTimezone: string
}) {
  const ref = useDrag({ type: ItemType, item: { index } })[1]
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveEntry(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  const localTime = moment
    .utc(entry.timeOfArrival)
    .tz(userTimezone)
    .format('hh:mm A')

  return (
    <TableRow ref={(node) => ref(drop(node))} className='cursor-move'>
      <TableCell>{entry.puppyName}</TableCell>
      <TableCell>{entry.ownerName}</TableCell>
      <TableCell>{entry.serviceNeeded}</TableCell>
      <TableCell>{localTime}</TableCell>
      <TableCell>
        <Checkbox
          checked={entry.status === 'SERVED'}
          onCheckedChange={() => handleMarkAsServiced(entry.id)}
          aria-label='Mark as serviced'
        />
      </TableCell>
    </TableRow>
  )
}
