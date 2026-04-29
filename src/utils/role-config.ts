import {
  // Force rebuild to resolve potential 404 issue
  LayoutDashboard, School, Users, GraduationCap, BookOpen, Calendar,
  ClipboardList, DollarSign, Video, Bell, BarChart3, FileText,
  Clock, UserCheck, CreditCard, Megaphone, Settings as SettingsIcon,
} from 'lucide-react';
import { RoleName } from '@/types/auth.types';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export const ROLE_NAV_ITEMS: Record<RoleName, NavItem[]> = {
  PROJECT_ADMIN: [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Schools', href: '/admin/schools', icon: School },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { title: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ],
  SCHOOL_ADMIN: [
    { title: 'Dashboard', href: '/school', icon: LayoutDashboard },
    { title: 'Teachers', href: '/school/teachers', icon: Users },
    { title: 'Students', href: '/school/students', icon: GraduationCap },
    { title: 'Classes', href: '/school/classes', icon: School },
    { title: 'Subjects', href: '/school/subjects', icon: BookOpen },
    { title: 'Fee Management', href: '/school/fees', icon: DollarSign },
    { title: 'Exams', href: '/school/exams', icon: ClipboardList },
    { title: 'Attendance', href: '/school/attendance', icon: UserCheck },
    { title: 'Timetable', href: '/school/timetable', icon: Calendar },
    { title: 'Notes', href: '/school/notes', icon: BookOpen },
    { title: 'Online Classes', href: '/school/online-classes', icon: Video },
    { title: 'Announcements', href: '/school/announcements', icon: Megaphone },
    { title: 'Reports', href: '/school/reports', icon: BarChart3 },
  ],
  TEACHER: [
    { title: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { title: 'My Timetable', href: '/teacher/timetable', icon: Calendar },
    { title: 'Attendance', href: '/teacher/attendance', icon: UserCheck },
    { title: 'Exams & Marks', href: '/teacher/exams', icon: ClipboardList },
    { title: 'Notes', href: '/teacher/notes', icon: BookOpen },
    { title: 'Online Classes', href: '/teacher/online-classes', icon: Video },
  ],
  STUDENT: [
    { title: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { title: 'Timetable', href: '/student/timetable', icon: Calendar },
    { title: 'Notes', href: '/student/notes', icon: BookOpen },
    { title: 'Results', href: '/student/results', icon: FileText },
    { title: 'Fees', href: '/student/fees', icon: CreditCard },
    { title: 'Attendance', href: '/student/attendance', icon: Clock },
  ],
  PARENT: [
    { title: 'Dashboard', href: '/parent', icon: LayoutDashboard },
    { title: 'Performance', href: '/parent/performance', icon: BarChart3 },
    { title: 'Fees', href: '/parent/fees', icon: CreditCard },
    { title: 'Attendance', href: '/parent/attendance', icon: Clock },
  ],
};

export const ROLE_COLORS: Record<RoleName, string> = {
  PROJECT_ADMIN: 'from-violet-600 to-indigo-600',
  SCHOOL_ADMIN: 'from-blue-600 to-cyan-600',
  TEACHER: 'from-emerald-600 to-teal-600',
  STUDENT: 'from-amber-500 to-orange-500',
  PARENT: 'from-rose-500 to-pink-500',
};
