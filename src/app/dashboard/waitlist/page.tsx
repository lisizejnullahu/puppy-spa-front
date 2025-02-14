import Waitlist from '../../../components/waitlist/WaitlistTable'

export default function WaitlistPage() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Todays Waitlist</h1>
      <Waitlist />
    </div>
  )
}
