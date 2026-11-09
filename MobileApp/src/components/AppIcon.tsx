import React from 'react';
import {
  House,
  Search,
  CalendarDays,
  Receipt,
  User,
  LayoutDashboard,
  Droplets,
  Tag,
  Building2,
  Users,
  Car,
  MapPin,
  Star,
  Clock,
  Navigation,
  Map,
  List,
  Phone,
} from 'lucide-react-native';

const ICONS = {
  home: House,
  search: Search,
  calendar: CalendarDays,
  receipt: Receipt,
  user: User,
  dashboard: LayoutDashboard,
  services: Droplets,
  tag: Tag,
  business: Building2,
  users: Users,
  car: Car,
  pin: MapPin,
  star: Star,
  clock: Clock,
  directions: Navigation,
  map: Map,
  list: List,
  phone: Phone,
};

export type IconName = keyof typeof ICONS;

type Props = { name: IconName; size?: number; color: string; strokeWidth?: number };

export default function AppIcon({ name, size = 22, color, strokeWidth = 2 }: Props) {
  const Icon = ICONS[name];
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}