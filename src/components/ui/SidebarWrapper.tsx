import { ReactNode } from 'react'

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  return <div className='sidebar-wrapper'>{children}</div>
}
