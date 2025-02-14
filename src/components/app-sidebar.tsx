import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar'

const navLinks = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Waitlist', href: '/dashboard/waitlist' },
  { title: 'Appointments', href: '/dashboard/appointments' },
  { title: 'Services', href: '/dashboard/services' },
  { title: 'Settings', href: '/dashboard/settings' },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar
      {...props}
      className={`transition-transform duration-200 ease-in-out ${
        state === 'collapsed' ? '-translate-x-full' : 'translate-x-0'
      }`}
    >
      <SidebarHeader>
        <h2 className='text-lg font-bold'>Puppy Spa</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href} className='w-full'>
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail onClick={toggleSidebar} />
    </Sidebar>
  )
}
