import React from 'react';
import { MdMenu } from 'react-icons/md';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onMenuClick, 
  showMenuButton = false,
  rightContent 
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 
                transition-colors duration-200 touch-manipulation -ml-2"
                aria-label="Open menu"
              >
                <MdMenu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
          </div>
          
          {rightContent && (
            <div className="flex items-center gap-4">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
