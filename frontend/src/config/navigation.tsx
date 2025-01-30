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
    icon: MdHome
  },
  {
    label: 'Districts',
    path: '/districts',
    icon: MdLocationOn
  },
  {
    label: 'Shelters',
    path: '/shelters',
    icon: MdMap
  },
  {
    label: 'Manage Shelters',
    path: '/manage-shelters',
    icon: MdSettings
  },
  {
    label: 'Resource Analytics',
    path: '/resource-analyticts',
    icon: MdAnalytics
  },
  {
    label: 'Allocate Resources',
    path: '/allocate-district-resources',
    icon: MdManageHistory
  }
  
];
