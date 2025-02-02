import { NavItem } from '../types/layoutTypes';
import { 
  MdHome, 
  MdLocationOn, 
  MdAnalytics,
  MdSettings,
  MdMap,
  MdManageHistory
} from 'react-icons/md';

export const mainNavItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
    icon: MdHome,
    roles: ['admin', 'authority', 'volunteer', 'user'] // everyone can access home
  },
  {
    label: 'Districts',
    path: '/districts',
    icon: MdLocationOn,
    roles: ['admin'] // only admin can manage districts
  },
  {
    label: 'Shelters',
    path: '/shelters',
    icon: MdMap,
    roles: ['user', 'admin', 'authority', 'volunteer'] // these roles can view shelters
  },
  {
    label: 'Manage Shelters',
    path: '/manage-shelters',
    icon: MdSettings,
    roles: ['admin', 'authority'] // only admin and authority can manage shelters
  },
  {
    label: 'Resource Analytics',
    path: '/resource-analyticts',
    icon: MdAnalytics,
    roles: ['user', 'admin', 'authority'] // only admin and authority can view analytics
  },
  {
    label: 'Allocate Resources',
    path: '/allocate-district-resources',
    icon: MdManageHistory,
    roles: ['authority'] // only admin and authority can allocate resources
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: MdSettings,
    roles: ['user', 'admin', 'authority', 'volunteer'] // everyone can access settings
  }
];
