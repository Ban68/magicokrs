
import React from 'react';
import { User, Team } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AddIcon, UserIcon, TrashIcon, UsersGroupIcon } from '../components/ui/Icons';

interface SettingsScreenProps {
  users: User[];
  teams: Team[];
  onAddUser: () => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
  onAddTeam: () => void;
  onDeleteTeam: (teamId: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ users, teams, onAddUser, onDeleteUser, currentUser, onAddTeam, onDeleteTeam }) => {
  const getTeamName = (teamId?: string) => {
    return teams.find(t => t.id === teamId)?.name || 'No team';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings & Members</h1>
        <p className="mt-1 text-slate-600">Manage users and teams in your organization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Users Card */}
        <Card>
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-slate-500"/>
                Users ({users.length})
              </h2>
              <Button id="settings-add-user" onClick={onAddUser} variant="secondary" size="sm" leftIcon={<AddIcon />}>
                Add User
              </Button>
          </div>
          <ul role="list" className="divide-y divide-slate-200">
            {users.map((user) => (
              <li key={user.id} className="group flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="flex items-center space-x-4">
                  <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                  <div className="font-medium text-slate-800">{user.name}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-500 flex items-center">
                    <UsersGroupIcon className="h-4 w-4 mr-1.5 text-slate-400" />
                    {getTeamName(user.teamId)}
                  </div>
                  {user.id !== currentUser.id && (
                    <button 
                      onClick={() => onDeleteUser(user.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                      aria-label={`Delete ${user.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Teams Card */}
        <Card>
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <UsersGroupIcon className="h-5 w-5 mr-2 text-slate-500"/>
                Teams ({teams.length})
              </h2>
              <Button id="settings-add-team" onClick={onAddTeam} variant="secondary" size="sm" leftIcon={<AddIcon />}>
                Add Team
              </Button>
          </div>
          <ul role="list" className="divide-y divide-slate-200">
            {teams.map((team) => (
              <li key={team.id} className="group flex items-center justify-between p-4 hover:bg-slate-50">
                <div className="font-medium text-slate-800">{team.name}</div>
                <button 
                  onClick={() => onDeleteTeam(team.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                  aria-label={`Delete ${team.name}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
