import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Users, Accessibility, ShoppingCart, CreditCard, Shapes, MapPin, Bell, Settings, LogOut } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
   {
    title: 'Rental Management',
    href: '/rentals',
    icon: ShoppingCart,
  },
  {
    title: 'Transaction Management',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    title: 'Wheelchair Management',
    href: '/wheelchairs',
    icon: Accessibility,
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
  },
  
 
  
  {
    title: 'Cities',
    href: '/categories-cities',
    icon: Shapes, // Using Shapes as a generic icon for both
  },
  // {
  //   title: 'Notifications',
  //   href: '/notifications',
  //   icon: Bell,
  // },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // },
];

export const bottomNavItems: NavItem[] = [
    {
        title: 'Logout',
        href: '/login', // Placeholder for logout functionality
        icon: LogOut,
    }
]

export const APP_NAME = "Flying Monk";
