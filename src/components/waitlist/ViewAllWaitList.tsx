'use client'

import { useEffect, useState } from 'react'
import { fetchAllWaitlists } from '@/lib/api'
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

export default function ViewAllWaitList() {
  const [waitlists, setWaitlists] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState<any[]>([])

  useEffect(() => {
    fetchAllWaitlists(7).then((data) => {
      setWaitlists(data || [])
      setFilteredEntries(data?.flatMap((w) => w.entries) || [])
    })
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEntries(waitlists.flatMap((w) => w.entries) || [])
      return
    }

    const searchResults = waitlists.flatMap((w) =>
      w.entries.filter(
        (entry: any) =>
          entry.puppyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

    setFilteredEntries(searchResults)
  }, [searchQuery, waitlists])

  return (
    <div className='w-full'>
      <h2 className='text-xl font-bold mb-4'>View All Waitlists</h2>

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
              <TableHead>Date</TableHead>
              <TableHead>Puppy Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {moment.utc(entry.timeOfArrival).format('YYYY-MM-DD')}
                  </TableCell>
                  <TableCell>{entry.puppyName}</TableCell>
                  <TableCell>{entry.ownerName}</TableCell>
                  <TableCell>{entry.serviceNeeded}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
