import React from 'react';
import { AppScreen } from '../../types';
import { DashboardIcon, CompanyIcon, UserIcon, SparkleIcon, RetrospectiveIcon, SettingsIcon } from '../ui/Icons';

interface SidebarProps {
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  id?: string;
}> = ({ icon, label, isActive, onClick, id }) => (
  <button
    id={id}
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setCurrentScreen }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-8 px-2">
          <SparkleIcon className="h-8 w-8 text-brand-600" />
          <h1 className="ml-2 text-xl font-bold text-slate-800">OKR Catalyst</h1>
        </div>
        <nav className="space-y-2">
          <NavItem
            id="sidebar-dashboard"
            icon={<DashboardIcon className="h-5 w-5" />}
            label="Dashboard"
            isActive={currentScreen === 'dashboard'}
            onClick={() => setCurrentScreen('dashboard')}
          />
          <NavItem
            id="sidebar-company"
            icon={<CompanyIcon className="h-5 w-5" />}
            label="Company OKRs"
            isActive={currentScreen === 'company'}
            onClick={() => setCurrentScreen('company')}
          />
          <NavItem
            icon={<UserIcon className="h-5 w-5" />}
            label="My OKRs"
            isActive={currentScreen === 'my-okrs'}
            onClick={() => setCurrentScreen('my-okrs')}
          />
          <NavItem
            icon={<RetrospectiveIcon className="h-5 w-5" />}
            label="Retrospective"
            isActive={currentScreen === 'retrospective'}
            onClick={() => setCurrentScreen('retrospective')}
          />
        </nav>
      </div>
      <div>
        <nav className="space-y-2 mb-4 border-t border-slate-200 pt-4">
           <NavItem
                id="sidebar-settings"
                icon={<SettingsIcon className="h-5 w-5" />}
                label="Settings"
                isActive={currentScreen === 'settings'}
                onClick={() => setCurrentScreen('settings')}
            />
        </nav>
        <div className="text-xs text-slate-400 text-center">
            &copy; {new Date().getFullYear()} OKR Catalyst
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;