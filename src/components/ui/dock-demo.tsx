import {
  SunMoon,
  Bell,
  UserPlus,
  Activity,
} from 'lucide-react';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const data = [
  {
    title: 'Dark Mode',
    icon: (
      <SunMoon className='w-6 h-6 text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Notifications',
    icon: (
      <Bell className='w-6 h-6 text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Add Member',
    icon: (
      <UserPlus className='w-6 h-6 text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
  {
    title: 'Services Status',
    icon: (
      <Activity className='w-6 h-6 text-neutral-600 dark:text-neutral-300' />
    ),
    href: '#',
  },
];

export function AppleStyleDock() {
  return (
    <div className='relative p-2'>
      <Dock className='items-end pb-3'>
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800'
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>
              {item.icon}
            </DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}

