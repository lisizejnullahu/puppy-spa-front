'use client'

import { useState } from 'react'
import { addToWaitlist, fetchWaitlist, createWaitlist } from '@/lib/api'
import moment from 'moment-timezone'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

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
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const { toast } = useToast()

  const handleAddToWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const todayUTC = moment().utc().format('YYYY-MM-DD')
      let waitlist = await fetchWaitlist(todayUTC)

      if (!waitlist?.id) {
        waitlist = await createWaitlist(todayUTC)
        if (!waitlist?.id) throw new Error('Failed to create waitlist.')
      }

      const fullDateTime = moment
        .tz(`${todayUTC}T${puppyData.timeOfArrival}:00`, userTimezone)
        .utc()
        .toISOString()

      const formattedData = { ...puppyData, timeOfArrival: fullDateTime }
      const response = await addToWaitlist(waitlist.id, formattedData)

      if (response) {
        toast({ title: 'Success', description: 'Puppy added to waitlist ✅' })
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
      toast({
        title: 'Error',
        description: 'Something went wrong ❌',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto border shadow-md bg-background text-foreground'>
      <CardHeader className='border-b'>
        <CardTitle className='text-lg font-semibold'>Add to Waitlist</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <form onSubmit={handleAddToWaitlist} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='puppyName'>Puppy Name</Label>
            <Input
              id='puppyName'
              type='text'
              placeholder="Enter puppy's name"
              value={puppyData.puppyName}
              onChange={(e) =>
                setPuppyData({ ...puppyData, puppyName: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ownerName'>Owner Name</Label>
            <Input
              id='ownerName'
              type='text'
              placeholder="Enter owner's name"
              value={puppyData.ownerName}
              onChange={(e) =>
                setPuppyData({ ...puppyData, ownerName: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='serviceNeeded'>Service Needed</Label>
            <Input
              id='serviceNeeded'
              type='text'
              placeholder='Enter service needed'
              value={puppyData.serviceNeeded}
              onChange={(e) =>
                setPuppyData({ ...puppyData, serviceNeeded: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='timeOfArrival'>Time of Arrival</Label>
            <Input
              id='timeOfArrival'
              type='time'
              className='bg-background text-foreground'
              value={puppyData.timeOfArrival}
              onChange={(e) =>
                setPuppyData({ ...puppyData, timeOfArrival: e.target.value })
              }
              required
            />
          </div>
          <Separator />
          <Button
            type='submit'
            className='w-full bg-black text-white dark:bg-white dark:text-black border border-gray-700 dark:border-gray-300 transition-all'
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add to Waitlist'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
