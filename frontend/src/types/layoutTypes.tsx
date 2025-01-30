import { IconType } from 'react-icons';

export interface NavItem {
    label: string;
    path: string;
    icon: IconType;
  }
  
export interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: NavItem[];
  }
  
export interface PageLayoutProps {
    children: React.ReactNode;
    title: string;
    navItems: NavItem[];
    headerRightContent?: React.ReactNode;
  }
  
export interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
    rightContent?: React.ReactNode;
  }
  
  