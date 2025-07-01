import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import { AddIcon, ChevronDownIcon, CheckIcon } from '../ui/Icons';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onChangeUser: (userId: string) => void;
  onNewOkrClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, allUsers, onChangeUser, onNewOkrClick }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1">
          {/* Search bar could go here */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
            <Button id="header-new-okr" onClick={onNewOkrClick} leftIcon={<AddIcon />}>
              New OKR
            </Button>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <img className="h-9 w-9 rounded-full" src={currentUser.avatarUrl} alt={currentUser.name} />
              <span className="text-sm font-medium text-slate-700 hidden sm:inline">{currentUser.name}</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-500" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onChangeUser(user.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                         <img className="h-7 w-7 rounded-full mr-3" src={user.avatarUrl} alt={user.name} />
                         <span>{user.name}</span>
                      </div>
                      {user.id === currentUser.id && (
                        <CheckIcon className="h-5 w-5 text-brand-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;