import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import { IconType } from 'react-icons';

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navItems }) => {
  const location = useLocation();

  return (
    <div className={`
      fixed md:static inset-y-0 left-0 transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 transition-transform duration-300 ease-in-out
      bg-green-900 text-white w-[260px] md:w-64 flex flex-col h-screen z-40
      overflow-y-auto overscroll-contain safe-top safe-bottom
    `}>
      <div className="sticky top-0 bg-green-900 p-4 flex justify-between items-center
        border-b border-green-800">
        <h2 className="text-xl font-bold">CrisisCompass</h2>
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-green-800 active:bg-green-700 
          transition-colors duration-200 touch-manipulation -mr-1"
          aria-label="Close menu"
        >
          <MdClose className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-grow">
        <ul className="flex flex-col py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} className="px-2">
                <Link
                  to={item.path}
                  className={`
                    w-full text-left py-3.5 px-4 rounded-lg
                    transition duration-200 text-[15px] font-medium
                    touch-manipulation flex items-center gap-3
                    ${isActive 
                      ? 'bg-green-800 text-white' 
                      : 'hover:bg-green-800/50 active:bg-green-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
