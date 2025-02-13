import axios from 'axios'
import { getSession } from 'next-auth/react'
import moment from 'moment-timezone'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    console.log('Session in API Interceptor:', session)

    if (session?.accessToken) {
      console.log('Attaching Token:', session.accessToken)
      config.headers.Authorization = `Bearer ${session.accessToken}`
    } else {
      console.warn('No token found in session!')
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const addToWaitlist = async (waitlistId: number, data: any) => {
  try {
    const response = await api.post(`/waitlists/${waitlistId}/entries`, data)
    return response.data
  } catch (error) {
    console.error('❌ Error adding to waitlist:', error)
    return null
  }
}

export const fetchWaitlist = async (date?: string) => {
  const todayUTC = moment().utc().format('YYYY-MM-DD')
  const targetDate = date || todayUTC

  console.log(`📅 Fetching waitlist for (UTC): ${targetDate}`)

  try {
    const response = await api.get(`/waitlist/date/${targetDate}`)
    console.log('Fetched waitlist data:', response.data)

    if (response.data?.entries) {
      response.data.entries = response.data.entries
        .map((entry: any) => ({
          ...entry,
          waitlistId: response.data.id,
        }))
        .sort((a, b) => a.orderIndex - b.orderIndex)
    }

    return response.data ?? { id: null, entries: [] }
  } catch (error) {
    console.error('Error fetching waitlist:', error)
    return { id: null, entries: [] }
  }
}

export const updateWaitlistOrder = async (entries: any[]) => {
  try {
    const orderedEntries = entries.map((entry, index) => ({
      id: entry.id,
      orderIndex: index,
    }))

    const response = await api.put(
      '/waitlist/reorder',
      { entries: orderedEntries },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data
  } catch (error) {
    return null
  }
}

export const createWaitlist = async (date: string) => {
  try {
    const response = await api.post('/waitlist', { date })
    return response.data
  } catch (error) {
    console.error('❌ Error creating waitlist:', error)
    return null
  }
}

export const searchWaitlistEntries = async (query: string) => {
  try {
    const response = await api.get(`/waitlist/search?query=${query}`)
    return response.data
  } catch (error) {
    console.error('❌ Error searching waitlist:', error)
    return []
  }
}

export const markAsServiced = async (
  waitlistId: number,
  entryId: number,
  status: string
) => {
  try {
    const response = await api.patch(
      `/waitlist/${waitlistId}/entries/${entryId}/status`,
      { status }
    )
    return response.data
  } catch (error) {
    console.error('Error updating status:', error)
    return null
  }
}
