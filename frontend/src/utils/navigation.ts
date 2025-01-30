import { NavItem } from '../types/layoutTypes';

export const filterNavItemsByRole = (navItems: NavItem[], userRole?: string | null): NavItem[] => {
    if (!userRole) return [];
    
    return navItems.filter(item => 
        item.roles ? item.roles.includes(userRole) : true
    );
};
