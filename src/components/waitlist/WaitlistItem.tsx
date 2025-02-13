import { useDrag, useDrop } from 'react-dnd'
import moment from 'moment-timezone'

const ItemType = 'ENTRY'

export default function WaitlistItem({
  entry,
  index,
  moveEntry,
  handleMarkAsServiced,
  userTimezone,
}: {
  entry: any
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

  const localTimeOfArrival = moment
    .utc(entry.timeOfArrival)
    .tz(userTimezone)
    .format('hh:mm A')

  return (
    <li
      ref={(node) => ref(drop(node))}
      className={`border p-2 rounded mt-2 cursor-move bg-gray-100 ${
        entry.status === 'SERVED' ? 'opacity-50 line-through' : ''
      }`}
    >
      <input
        type='checkbox'
        checked={entry.status === 'SERVED'}
        onChange={() => handleMarkAsServiced(entry.id)}
        className='mr-2'
      />
      <strong>{entry.puppyName}</strong> - {entry.serviceNeeded}
      <p className='text-gray-500 text-sm'>
        {entry.ownerName} | Arrival: {localTimeOfArrival}
      </p>
    </li>
  )
}
